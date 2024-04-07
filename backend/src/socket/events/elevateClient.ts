/***** UTILITIES *****/
// import { getClientById, sendToClient } from "../store/helpers";

/***** TYPE DEFINITIONS *****/
import type { User } from "@prisma/client";
import type { TAuthorizationLevels } from "../store/types";
import { socketManager } from "../store";

/***** COMPONENT START *****/
export const elevateClient = (clientId: string, { id }: User) => {
  // since we do not currently store this in the database, we will hardcode the level
  const level = 'user' as TAuthorizationLevels;
  const client = socketManager.getClientById(clientId);

  if (client) {
    client.authorization.level = level;
    client.userId = id;

    socketManager.sendToClient(client, {
      type: 'authorization',
      level
    });

    return { success: 'client elevated' }
  } else {
    return { error: 'client not found' }
  }
}