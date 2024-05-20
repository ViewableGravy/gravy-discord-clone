/***** IMPORTS *****/
import { handleClientMessage, handleServerMessage } from "./message";

/***** TYPE IMPORTS *****/
import type { BaseClient, Client, Direction, Props, Routes, UnidentifiedBaseClient } from "./type";

/***** TYPE DEFINITIONS *****/
type GenerateConnectionHandlers = <
  TClient extends Client, 
  TDirection extends Direction
>(props: { routes: Routes } & Props<TClient, TDirection>) => (ws: WebSocket) => void;

/***** COMPONENT START *****/
export const generateConnectionHandlers: GenerateConnectionHandlers = (props) => {
  const { store, initializeClient } = props;

  /**
   * ServerHandler - Handles a connection event when the web socket is running in server mode (direction)
   * 
   * @param ws - The web socket object 
   */
  const serverHandler = (ws: WebSocket) => {
    if (props.direction !== 'server') 
      throw new Error('serverHandler must be invoked using a server direction');

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
    return handleServerMessage({ client, ...props });
  }

  const clientHandler = (ws: WebSocket) => {
    if (props.direction !== 'client') 
      throw new Error('clientHandler must be invoked using a client direction');

    const client: UnidentifiedBaseClient = {
      ws,
      awaitingVerification: true,
      send: (data) => ws.send(JSON.stringify(data)),
    }

    return handleClientMessage({ client, ...props });
  }

  /***** RETURN *****/
  return props.direction === 'server' 
    ? serverHandler 
    : clientHandler;
}
