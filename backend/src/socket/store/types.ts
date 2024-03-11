export type TAuthorizationLevels = 'guest' | 'user' | 'admin';
export type TClient = {
  identifier: string;
  rooms: Set<string>;
  ws: WebSocket;
  authorization: {
    level: TAuthorizationLevels;
  }
}
export type TCreateMeProps = Partial<Omit<TClient, 'ws'>> & { ws: WebSocket; }
