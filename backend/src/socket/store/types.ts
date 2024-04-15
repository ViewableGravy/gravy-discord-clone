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
}



//new
export type WebSocketClient = {
  identifier: string;
  rooms: Set<string>;
  ws: WebSocket;
}