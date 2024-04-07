import { WebSocketServer } from 'ws';
import { socketManager } from './store';
import { DEBUG_LEVELS } from '../models/enums';
import { log } from '../utilities/logging';
import { baseValidators, getTypeLiteralAsString } from '../validators/socket/base';
import { generateHandleRoom } from './handlers/handleRoom';

/***** SERVER START *****/
export const socketServer = new WebSocketServer({
  noServer: true,
})

socketServer.on('connection', socketManager.withMe(({ ws, me }) => {
  // Generate handlers
  const handleRoom = generateHandleRoom(me);

  // Handle messages
  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message?.toString());
      const typeValidated = baseValidators.base.parse(parsed)

      //parsed now has a type property
      switch (typeValidated.type) {
        case getTypeLiteralAsString('join-room'): 
        case getTypeLiteralAsString('leave-room'):
          return handleRoom(parsed)
        default:
          return;
      }
    } catch (e) {
      if (e instanceof Error) {
        switch (e.name) {
          case 'ZodError':
            return log(DEBUG_LEVELS.ERROR, e.message)
        }
      }

      log(DEBUG_LEVELS.ERROR, e)
    }
  })

}));
