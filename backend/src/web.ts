import express from 'express';
import { aliveRoute } from './routes/alive';
import { createAuthenticatedRouteCallback } from './models/base';

const server =  express();

server.get('/ami/alive', aliveRoute);
server.get('/ami/authorized', createAuthenticatedRouteCallback('test', ({ builder }) => {
  builder({ status: 200, data: 'You are authorized' });
}))


server.listen(3000, () => {
  console.log('Server is running on port 3000');
});