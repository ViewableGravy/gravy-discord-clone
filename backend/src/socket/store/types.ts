import type { z } from "zod";

export type TAuthorizationLevels = 'guest' | 'user' | 'admin';
export type TClient = {
  identifier: string;
  rooms: Set<string>;
  ws: WebSocket;
  authorization: {
    level: TAuthorizationLevels;
  },
  userId?: string;
}
export type TCreateMeProps = Partial<Omit<TClient, 'ws'>> & { ws: WebSocket; }

export type TCreateUserArgs = Partial<Omit<TClient, 'ws'>> & { ws: WebSocket; }
export type TUnidentifiedClient = {
  ws: WebSocket;
  awaitingIdentification: true;
  send: (data: any) => void;
}



//new
export type WebSocketClient = {
  identifier: string;
  rooms: Set<string>;
  ws: WebSocket;
  send: (data: any) => void;
}

export type TSocketHandlerArgs<Validator extends z.AnyZodObject> = {
  data: z.infer<Validator>,
  client: WebSocketClient,
  builder: (client: WebSocketClient) => void
}

export type TSocketRouteCallback<Validator extends z.AnyZodObject> = (args: TSocketHandlerArgs<Validator>) => void;