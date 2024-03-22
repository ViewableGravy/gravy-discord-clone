/***** UTILITIES *****/
import { sendToClient } from "../store/helpers";

/***** TYPE DEFINITIONS *****/
import type { TClient } from "../store/types";

/***** COMPONENT START *****/
export const deElevateClient = (client: TClient) => {
  if (!client) {
    return { error: 'client not found' }
  }

  client.authorization.level = 'guest';
  client.userId = undefined;

  sendToClient(client, {
    type: 'authorization',
    level: 'guest'
  });
}