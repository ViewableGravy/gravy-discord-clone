/***** BASE IMPORTS *****/
import { WebSocketServer } from 'ws';

/***** UTILITIES *****/
import { log } from 'src/utilities/logging';

/***** TYPE DEFINITIONS *****/
import type { SocketRouteCallback, Client, Props, Direction, BaseClient } from "./type";
import type { Server } from 'http';
import type { z } from 'zod';
import { socketServerValidators } from './validator';

/***** COMPONENT START *****/
export const generateSocketServer = <TClient extends Client, TDirection extends Direction>(props: Props<TClient, TDirection>) => {
  /***** PROPS *****/
  const { store, initializeClient, dependencies = {} } = props;

  /***** STATE *****/
  const routes: Record<string, (props: any) => void> = {};
  const server = new WebSocketServer({
    noServer: true,
  });

  /***** HANDLERS *****/
  const handleMessage = (direction: Direction, client: BaseClient) => {
    // server logic
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
        builder: dependencies.builder?.(client) ?? builder(client),
        body: parsed.data.body, 
      });
    })
  }

  server.on('connection', (ws) => {
    switch (props.direction) {
      case 'server': {
        const { generateIdentifier } = props;

        const client: BaseClient = {
          identifier: generateIdentifier(ws),
          rooms: new Set(),
          ws,
          send: (data) => ws.send(JSON.stringify(data)),
        }

        const initializationObject = {
          type: 'server-connection',
          rooms: Array.from(client.rooms),
          identifier: client.identifier,
        } as const;

        store.create(client);
        client.send(initializeClient?.(initializationObject) ?? initializationObject);
        handleMessage('server', client);
        return;
      }
      case 'client':
      default: {
        // handle client side authentication logic
      }
    }
  })

  /***** INTERVALS *****/
  setInterval(() => {
    Object.values(store.raw()).forEach(({ identifier, ws }) => {
      if (ws.readyState === ws.CLOSED) {
        store.delete(identifier);
      }
    });
  }, 10000);

  /***** PRIVATE FUNCTIONS *****/
  function builder(client: BaseClient) {
    return ({ status }: { status: 'success' | 'error' }) => {
      client.send({ status });
    }
  }

  /***** PUBLIC FUNCTIONS *****/
  /**
   * Route: A Route function that will be called when a client sends a message to the server
   * 
   * @param route - The route that the client is trying to access
   * @param validator - The schema that the client's request must adhere to
   * @param handler - The function that will be called if the client's request is valid
   */
  const route = <TValidator extends z.AnyZodObject>(
    route: string,
    validator: TValidator,
    handler: SocketRouteCallback<TValidator, TClient> 
  ) => {
    routes[route] = ({ client, body, builder }) => {
      const validated = validator.safeParse(body);

      if (!validated.success) {
        log('INFO', `${client.identifier} sent a malformed request to ${route}`)
        return builder({ error: validated.error });
      }

      return handler({ data: validated.data, client, builder });
    }
  }

  const connect = (route: string, httpServer: Server) => {
    httpServer.on('upgrade', (req, socket, head) => {    
      if (req.url === route) {
        server.handleUpgrade(req, socket, head, (ws) => {
          server.emit('connection', ws, req);
        })
      }
    })

    log('INFO', `WebSocket server is connected to ${route}`);
  }

  const byIdentifier = (identifier: string) => {
    return store.read(identifier);
  }

  const byRoom = (room: string) => {
    return Object.values(store.raw()).filter((client) => client.rooms.has(room));
  }

  /***** RENDER *****/
  return {
    route,
    connect,
    client: {
      byIdentifier,
      byRoom
    }
  }
}