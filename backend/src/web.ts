/***** BASE IMPORTS *****/
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

/***** SOCKET IMPORTS *****/
import { socketServer } from './socket';

/***** ROUTE IMPORTS *****/
import { aliveRoute } from './routes/ami/alive';
import { authenticatedRoute } from './routes/ami/authenticated';
import { testInvalidateRoute } from './routes/test/invalidate';
import { createAccount } from './routes/auth/createAccount';
import { loginRoute } from './routes/auth/authenticate';
import { refreshRoute } from './routes/auth/refresh';
import { logoutRoute } from './routes/auth/logout';

/***** CRON IMPORTS *****/
import { initializeClearSessionsCron } from './crons/clearSessions';

/***** SERVER SETUP *****/
const server =  express();

server.use(cors());
server.use(bodyParser.json());

/***** DEVELOPMENT ROUTES ******/
if (Bun.env.NODE_ENV === 'development') {
  server.post('/api/test/invalidate', testInvalidateRoute)
}

/***** ROUTES ******/
server.get('/api/ami/alive', aliveRoute);
server.get('/api/ami/authorized', authenticatedRoute);

server.post('/api/auth/signup', createAccount)
server.post('/api/auth/login', loginRoute)
server.post('/api/auth/refresh', refreshRoute)
server.post('/api/auth/logout', logoutRoute)

server.all('*', (_, res) => {
  res.status(404).send('Not found');
})

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

/***** CRONS *****/
initializeClearSessionsCron();