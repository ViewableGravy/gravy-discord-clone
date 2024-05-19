/***** UTILITIES *****/
// import { getClientById, sendToClient } from "../store/helpers";

/***** TYPE DEFINITIONS *****/
import type { User } from "prisma/generated/auth";
// import type { TAuthorizationLevels } from "../store/types";
// import { socketManager } from "../store";
import { wsServer } from "src/singleton";

/***** COMPONENT START *****/
export const elevateClient = (clientId: string, { id }: User) => {
  // const client = socketManager.getClientById(clientId);
  const client = wsServer.client.byIdentifier(clientId)

  if (client) {
    client.authorization.level = 'user';
    client.userId = id;

    client.send({
    // socketManager.sendToClient(client, {
      type: 'authorization',
      level: 'user'
    });

    return { success: 'client elevated' }
  } else {
    return { error: 'client not found' }
  }
}