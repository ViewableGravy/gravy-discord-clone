import WebSocket, { WebSocketServer } from 'ws';

/***** SERVER START *****/
export const socketServer = new WebSocketServer({
  noServer: true,
  clientTracking: false
})