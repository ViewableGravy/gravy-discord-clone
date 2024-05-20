/***** BASE IMPORTS *****/
import { z } from "zod";

/***** VALIDATORS *****/
import { socketServerValidators } from "./validator";

/***** TYPE IMPORTS *****/
import { type InferClientFromStore, type BaseClient, type Client, type Direction, type Props, type Routes, type UnidentifiedBaseClient } from "./type";

/***** TYPE DEFINITIONS *****/
type ServerMessage = <
  TClient extends Client
>(props: Props<TClient, 'server'> & { routes: Routes, client: BaseClient }) => void;

type ClientMessage = <
  TClient extends Client
>(props: Props<TClient, 'client'> & { routes: Routes, client: BaseClient | UnidentifiedBaseClient }) => void;

type HandleRouteProps<
  TClient extends Client,
  TDirection extends Direction
> = Props<TClient, TDirection> & { client: BaseClient, message: string, routes: Routes };

const handleRoute = <TClient extends Client, TDirection extends Direction>({ client: _client , message, routes, store, dependencies }: HandleRouteProps<TClient, TDirection>) => {
  //parse route
  const parsed = socketServerValidators.route.safeParse(JSON.parse(message));

  // notify client of malformed request
  if (!parsed.success) {
    return _client.send({
      type: 'error',
      message: 'Malformed request. You may try again',
      request: message.toString(),
      canRetry: true,
    });
  }

  // get route handler
  const route = routes[parsed.data.route];

  // notify client of invalid route
  if (!route) {
    return _client.send({
      type: 'error',
      message: 'Route not found',
      request: parsed.data.route,
      canRetry: false,
    });
  }

  // get the client from the store (so that we have the full client, not just a base client)
  const client = store.read(_client.identifier);

  // almost guaranteed to exist
  if (!client) {
    return _client.send({
      type: 'error',
      message: 'Client not found',
      request: parsed.data.route,
      canRetry: false,
    });
  }

  // call the route
  return route({ 
    client, 
    builder: dependencies?.builder?.(client) ?? builder(client),
    body: parsed.data.body, 
  });
}

function builder(client: BaseClient) {
  type Props = { status: 'success' | 'error' };
  return ({ status }: Props) => {
    client.send({ status });
  }
}

const validateIndentificationMessage = z.object({
  type: z.literal('identification'),
  identifier: z.string(),
});

/***** EXPORTS *****/
export const handleServerMessage: ServerMessage = (props) => {
  const { client } = props;

  client.ws.on('message', async (msg) => {
    handleRoute<InferClientFromStore<typeof props.store>, 'server'>({
      ...props,
      client,
      message: msg.toString(),
    });
  })
}

export const handleClientMessage: ClientMessage = ({ store, initializeClient, ...props }) => {
  // mutableClient should be updated when we receive the ID from the client
  let mutableClient: UnidentifiedBaseClient | BaseClient = props.client;

  mutableClient.ws.on('message', async (msg) => {
    // convert message from buffer to a string
    const message = msg.toString();
    
    // Normal Message handler
    if (!('awaitingVerification' in mutableClient)) {
      // If we are here, we are certain that the client is a BaseClient
      return handleRoute<InferClientFromStore<typeof store>, 'client'>({ 
        ...props,
        store, 
        initializeClient,
        client: mutableClient, 
        message
      });
    }
      
    /**
     * Handle UnidentifiedBaseClients. These clients still need to send through their identification message and
     * be verified before they can be considered a Client.
     */
    try {
      const parsed = validateIndentificationMessage.parse(message);
      const isAuthorized = await props.verifyId(parsed.identifier);
      
      if (!isAuthorized) {
        mutableClient.send({
          type: 'error',
          message: 'You are not authorized to connect to this server.',
          canRetry: false,
        });

        return mutableClient.ws.close();
      }

      const client: BaseClient = {
        identifier: parsed.identifier,
        rooms: new Set<string>(),
        send: (data) => mutableClient.send(data),
        ws: mutableClient.ws
      }

      const initializationObject = {
        type: 'server-connection',
        rooms: Array.from(client.rooms),
        identifier: client.identifier,
      } as const;
      
      mutableClient = client;
      store.create(client);
      client.send(initializeClient?.(initializationObject) ?? initializationObject)
    } catch (e) {
      return mutableClient.send({
        type: 'error',
        message: 'An error occurred while trying to connect to the server.',
        canRetry: true,
      });
    }
  });
}