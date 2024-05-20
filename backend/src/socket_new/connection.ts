/***** IMPORTS *****/
import { handleServerMessage } from "./message";

/***** TYPE IMPORTS *****/
import type { BaseClient, Client, Direction, Props, Routes } from "./type";

/***** TYPE DEFINITIONS *****/
type GenerateConnectionHandlers = <
  TClient extends Client, 
  TDirection extends Direction
>(props: Props<TClient, TDirection>  & { routes: Routes }) => (ws: WebSocket) => void;

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
    handleServerMessage({ client, ...props });
    return;
  }

  /***** RETURN *****/
  return props.direction === 'server' 
    ? serverHandler 
    : () => {};
}
