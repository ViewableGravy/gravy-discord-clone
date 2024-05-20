/***** BASE IMPORTS *****/
import { WebSocketServer } from 'ws';

/***** UTILITIES *****/
import { log } from 'src/utilities/logging';

/***** TYPE DEFINITIONS *****/
import type { SocketRouteCallback, Client, Props, Direction, BaseClient } from "./type";
import type { Server } from 'http';
import type { z } from 'zod';
import { socketServerValidators } from './validator';
import { generateConnectionHandlers } from './connection';

/***** COMPONENT START *****/
export const generateSocketServer = <TClient extends Client, TDirection extends Direction>(props: Props<TClient, TDirection>) => {
  /***** PROPS *****/
  const { store } = props;

  /***** STATE *****/
  const routes: Record<string, (props: any) => void> = {};
  const handler = generateConnectionHandlers({ ...props, routes } as any);
  const server = new WebSocketServer({
    noServer: true,
  });

  /***** WEBSOCKET HANDLER *****/
  server.on('connection', handler)

  /***** INTERVALS *****/
  setInterval(() => {
    Object.values(store.raw()).forEach(({ identifier, ws }) => {
      if (ws.readyState === ws.CLOSED) {
        store.delete(identifier);
      }
    });
  }, 10000);

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

  /**
   * Connect: Connect the WebSocket server to a specific route on the HTTP server
   * 
   * @param route - The route that the WebSocket server will be connected to 
   * @param httpServer - The HTTP server that the WebSocket server will be connected to
   */
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

  /**
   * byIdentifier: Get a client by their identifier
   */
  const byIdentifier = (identifier: string) => {
    return store.read(identifier);
  }

  /**
   * byRoom: Get all clients in a specific room
   */
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