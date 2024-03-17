import express from 'express';
import { aliveRoute } from './routes/ami/alive';
import { socketServer } from './socket';
import { authenticatedRoute } from './routes/ami/authenticated';
import { testInvalidateRoute } from './routes/test/invalidate';
import { createAccount } from './routes/test/createAccount';

import cors from 'cors';
import bodyParser from 'body-parser';
import { authenticateRoute } from './routes/test/authenticate';

const server =  express();

server.use(cors());
server.use(bodyParser.json());

/***** DEVELOPMENT ROUTES ******/
if (Bun.env.NODE_ENV === 'development') {
  server.post('/api/test/invalidate', testInvalidateRoute)
  server.post('/api/test/authenticate', authenticateRoute)
}

/***** ROUTES ******/
server.get('/api/ami/alive', aliveRoute);
server.get('/api/ami/authorized', authenticatedRoute);

server.post('/api/auth/signup', createAccount)
server.post('/api/auth/login', () => {})

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