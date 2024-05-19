/***** BASE IMPORTS *****/
import cors from 'cors';
import bodyParser from 'body-parser';

/***** ROUTE IMPORTS *****/
import { aliveRoute } from './routes/ami/alive';
import { authenticatedRoute } from './routes/ami/authenticated';
// import { testInvalidateRoute } from './routes/test/invalidate';
import { createAccount } from './routes/auth/createAccount';
import { loginRoute } from './routes/auth/authenticate';
import { refreshRoute } from './routes/auth/refresh';
import { logoutRoute } from './routes/auth/logout';
import { usernameAvailabilityRoute } from './routes/auth/usernameAvailability';
import { verifyAccount } from './routes/auth/verify';

/***** CRON IMPORTS *****/
import { initializeClearSessionsCron } from './crons/clearSessions';
import { testSocketHandler } from './routes/sockets/test';
import { ROUTES } from './route-names';
import { leaveRoomSocketHandler } from './routes/sockets/invalidate/leave-room';
import { joinRoomSocketHandler } from './routes/sockets/invalidate/join-room';
import { log } from './utilities/logging';
import { server, wsServer } from './singleton';

/***** SERVER SETUP *****/
server.use(cors());
server.use(bodyParser.json());

/***** DEVELOPMENT ROUTES ******/
if (Bun.env.NODE_ENV === 'development') {
  // server.post('/api/test/invalidate', testInvalidateRoute)
}

/***** ROUTES ******/
server.get(ROUTES.HTTP.AMI.ALIVE, aliveRoute);
server.get(ROUTES.HTTP.AMI.AUTHORIZED, authenticatedRoute);

server.post(ROUTES.HTTP.AUTH.CREATE_ACCOUNT, createAccount)
server.post(ROUTES.HTTP.AUTH.LOGIN, loginRoute)
server.post(ROUTES.HTTP.AUTH.REFRESH, refreshRoute)
server.post(ROUTES.HTTP.AUTH.LOGOUT, logoutRoute)
server.post(ROUTES.HTTP.AUTH.USERNAME_AVAILABILITY, usernameAvailabilityRoute)
server.post(ROUTES.HTTP.AUTH.VERIFY_ACCOUNT, verifyAccount)

server.all('*', (_, res) => {
  res.status(404).send('Not found');
})

/***** SOCKET HANDLERS *****/
wsServer.route("/test", testSocketHandler.validate, testSocketHandler)
wsServer.route(ROUTES.SOCKETS.INVALIDATE.LEAVE_ROOM, leaveRoomSocketHandler.validate, leaveRoomSocketHandler)
wsServer.route(ROUTES.SOCKETS.INVALIDATE.JOIN_ROOM, joinRoomSocketHandler.validate, joinRoomSocketHandler)

/***** START SERVER *****/
const expressServer = server.listen(3000, () => {
  log('INFO', 'Server is running on port 3000');
});

wsServer.connect("/api/socket", expressServer);
// exampleWSServer.connect("/api/testing/socket", expressServer);

// handle socket upgrade
// expressServer.on('upgrade', (req, socket, head) => {
//   if (req.url === '/api/socket') {
//     socketServer.handleUpgrade(req, socket, head, (ws) => {
//       socketServer.emit('connection', ws, req);
//     })
//   }

//   if (req.url === '/api/socket') {
//     wsServer.socketServer.handleUpgrade(req, socket, head, (ws) => {
//       wsServer.socketServer.emit('connection', ws, req);
//     })
//   }
// })

/***** CRONS *****/
initializeClearSessionsCron();