/***** UTILITIES *****/
import { wsServer, type Client } from "authentication/singleton";
// import { socketManager } from "../store";

// /***** TYPE DEFINITIONS *****/
// import type { TClient } from "../store/types";

/***** COMPONENT START *****/
export const deElevateClient = (client: Client) => {
  if (!client) {
    return { error: 'client not found' }
  }

  client.authorization.level = 'guest';
  client.userId = undefined;

  client.send({
    type: 'authorization',
    level: 'guest'
  });
}