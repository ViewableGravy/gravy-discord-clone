/***** BASE IMPORTS *****/
import cors from 'cors';
import bodyParser from 'body-parser';

/***** ROUTE IMPORTS *****/
import { aliveRoute } from 'authentication/routes/ami/alive';
import { authenticatedRoute } from 'authentication/routes/ami/authenticated';
import { createAccount } from 'authentication/routes/auth/createAccount';
import { loginRoute } from 'authentication/routes/auth/authenticate';
import { refreshRoute } from 'authentication/routes/auth/refresh';
import { logoutRoute } from 'authentication/routes/auth/logout';
import { usernameAvailabilityRoute } from 'authentication/routes/auth/usernameAvailability';
import { verifyAccount } from 'authentication/routes/auth/verify';
import { testSocketHandler } from 'authentication/routes/sockets/test';
import { leaveRoomSocketHandler } from 'authentication/routes/sockets/invalidate/leave-room';
import { joinRoomSocketHandler } from 'authentication/routes/sockets/invalidate/join-room';

/***** CRON IMPORTS *****/
import { initializeClearSessionsCron } from './crons/clearSessions';

/***** INSTANCE IMPORTS *****/
import { server, wsServer } from './singleton';

/***** UTILITIES *****/
import { log } from 'shared/utilities/logging';

/***** CONSTS *****/
import { ROUTES } from 'authentication/routes';

/***** SERVER SETUP *****/
server.use(cors());
server.use(bodyParser.json());

/***** DEVELOPMENT ROUTES ******/
if (Bun.env.NODE_ENV === 'development') {
  
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

/***** CRONS *****/
initializeClearSessionsCron();