/***** BASE IMPORTS *****/
import type { z } from "zod";
import type { generateSocketServer } from ".";

/***** TYPE DEFINITIONS *****/
export type Direction = 'client' | 'server';
export type Routes = Record<string, (props: any) => void>;
export type BuilderProps = { status: 'success' | 'error' }

export type Dependencies = {
  builder?: <TClient extends Client>(client: TClient) => (options: BuilderProps) => void; 
}
export type BaseClient = {
  identifier: string;
  rooms: Set<string>;
  send: (data: any) => void;
  ws: WebSocket;
}
export type UnidentifiedBaseClient = {
  awaitingVerification: true;
  send: (data: any) => void;
  ws: WebSocket;
}
export type Client = BaseClient & Record<string, any>;
export type Store<TClient extends Client> = {
  create: (client: BaseClient) => Promise<void> | void;
  read: (identifier: string) => TClient | null;
  update: (identifier: string, client: NoInfer<TClient>) => Promise<void> | void;
  delete: (identifier: string) => Promise<void> | void;
  raw: () => Record<string, TClient>;
}

/**
 * 
 */
export type SocketHandlerArgs<Validator extends z.AnyZodObject, TClient extends Client> = {
  data: z.infer<Validator>,
  client: TClient,
  builder: (client: TClient) => void
}

/**
 * 
 */
export type SocketRouteCallback<Validator extends z.AnyZodObject, TClient extends Client> = (args: SocketHandlerArgs<Validator, TClient>) => void;

/**
 * Object that is sent to the client when the connection is established
 */
type InitializationObject = {
  type: 'server-connection',
  rooms: Array<string>,
  identifier: string
};

export type OnInitializeClient = (args: InitializationObject) => InitializationObject & Record<string, any>;

type ServerProps = {

  direction: 'server';

  /**
   * Callback function for generating an identifier for the client session.
   */
  generateIdentifier: (ws: WebSocket) => string;
}

type ClientProps = {

  direction: 'client';

  /**
   * Callback function to call when the client provides the identifier. This should make a request to an auth server
   * to verify that the ID is valid.
   * 
   * If information about the client needs to be stored in the external store, consider adding this functionality to the store.create function
   */
  verifyId: (id: string) => Promise<boolean>;

}

type TDirectionProps<TDirection extends Direction> = NoInfer<TDirection> extends 'client' ? ClientProps : ServerProps;

export type Props<
  TClient extends Client, 
  TDirection extends Direction
> = {
  /**
   * A store object which can be used by the socket server to store/update/retrieve information
   * about the client.
   */
  store: Store<TClient>;

  /**
   * When the client first connects, a message is sent to the client with information about the session.
   * This callback gives the option to add a middleware that can add additional information to the 
   * initialization
   */
  initializeClient?: OnInitializeClient;

  /**
   * Functionality that should be DI'd into the socket server. If these are not provided then defaults are used
   */
  dependencies?: Dependencies;
} & TDirectionProps<TDirection>; 

export type inferClient<TServer extends ReturnType<typeof generateSocketServer<any, any>>> = NonNullable<ReturnType<TServer['client']['byIdentifier']>>
export type InferClientFromStore<TStore extends Store<any>> = NonNullable<ReturnType<TStore['read']>>

