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
import { usernameAvailabilityRoute } from './routes/auth/usernameAvailability';
import { verifyAccount } from './routes/auth/verify';

/***** CRON IMPORTS *****/
import { initializeClearSessionsCron } from './crons/clearSessions';
import { DiscordWebSocketServer } from './socket/index.new';
import { randomUUID } from 'crypto';
import { z } from 'zod';

/***** SERVER SETUP *****/
const server =  express();
const wsServer = new DiscordWebSocketServer({
  identificationSource: "server"
})

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
server.post('/api/auth/username-availability', usernameAvailabilityRoute)
server.post('/api/auth/verify', verifyAccount)

server.all('*', (_, res) => {
  res.status(404).send('Not found');
})

const validateTest = z.object({
  room: z.literal('room/test'),
  message: z.string()
})

/***** SOCKET HANDLERS *****/
wsServer.route("/test", validateTest, ({ data }) => {
  console.log("we made it!:", data)
})



// start server
const expressServer = server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// handle socket upgrade
expressServer.on('upgrade', (req, socket, head) => {
  console.log(req.url)

  if (req.url === '/api/socket') {
    socketServer.handleUpgrade(req, socket, head, (ws) => {
      socketServer.emit('connection', ws, req);
    })
  }

  if (req.url === '/api/socket/test') {
    wsServer.socketServer.handleUpgrade(req, socket, head, (ws) => {
      wsServer.socketServer.emit('connection', ws, req);
    })
  }
})

/***** CRONS *****/
initializeClearSessionsCron();