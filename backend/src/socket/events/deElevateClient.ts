import { sendToClient } from "../store/helpers";
import type { TClient } from "../store/types";


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