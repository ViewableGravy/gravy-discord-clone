/***** UTILITIES *****/
import { socketManager } from "../store";

/***** TYPE DEFINITIONS *****/
import type { TClient } from "../store/types";

/***** COMPONENT START *****/
export const deElevateClient = (client: TClient) => {
  if (!client) {
    return { error: 'client not found' }
  }

  client.authorization.level = 'guest';
  client.userId = undefined;

  socketManager.sendToClient(client, {
    type: 'authorization',
    level: 'guest'
  });
}