import type { BaseClient, Client, Direction, OnInitializeClient, Routes, Store } from "./type";
import { socketServerValidators } from "./validator";

type Props<TClient extends Client> = {
  store: Store<TClient>;
  initializeClient?: OnInitializeClient;
  dependencies?: Record<string, any>;
  client: BaseClient;
  routes: Routes;
}

/**
 * 
 * @param direction - The direction of the message
 * @param client 
 */
export const handleServerMessage = <TClient extends Client>(props: Props<TClient>) => {
  const { client, routes, dependencies } = props;

  client.ws.on('message', async (msg) => {
    // convert message from buffer to a string
    const message = msg.toString();

    //parse route
    const parsed = socketServerValidators.route.safeParse(JSON.parse(message));

    // notify client of malformed request
    if (!parsed.success) {
      return client.send({
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
      return client.send({
        type: 'error',
        message: 'Route not found',
        request: parsed.data.route,
        canRetry: false,
      });
    }

    return route({ 
      client, 
      builder: dependencies?.builder?.(client) ?? builder(client),
      body: parsed.data.body, 
    });
  })
}

function builder(client: BaseClient) {
  type Props = { status: 'success' | 'error' };
  return ({ status }: Props) => {
    client.send({ status });
  }
}