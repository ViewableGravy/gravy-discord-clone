import express from 'express';
import { aliveRoute } from './routes/ami/alive';
import { socketServer } from './socket';
import { authenticatedRoute } from './routes/ami/authenticated';
import { testInvalidateRoute } from './routes/test/invalidate';
import { createRouteCallback } from './models/base';

import cors from 'cors';

const server =  express();

server.use(cors());

server.get('/api/ami/alive', aliveRoute);
server.get('/api/ami/authorized', authenticatedRoute);
server.get('/api/test/invalidate', testInvalidateRoute)
server.get('/api/test/example', createRouteCallback(({ builder }) => {

  return builder({
    status: 200,
    data: {
      message: 'Hello, World!'
    }
  })
}))

// start server
const expressServer = server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// handle socket upgrade
expressServer.on('upgrade', (req, socket, head) => {
  if (req.url === '/api/socket') {
    socketServer.handleUpgrade(req, socket, head, (ws) => {
      socketServer.emit('connection', ws, req);
    })
  }
})