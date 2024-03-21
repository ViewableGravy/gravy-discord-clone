/***** TYPE DEFINITIONS *****/
import type { User } from "@prisma/client";
import { getClientById, sendToClient } from "../store/helpers";
import type { TAuthorizationLevels } from "../store/types";

/***** CONSTS *****/
const functionResponses = {
  clientNotFound: {
    status: 404,
    data: 'Client not found',
    error: true
  }
} as const;

/***** COMPONENT START *****/
export const elevateClient = (clientId: string, { id }: User) => {
  // since we do not currently store this in the database, we will hardcode the level
  const level = 'user' as TAuthorizationLevels;
  const client = getClientById(clientId);

  if (client) {
    client.authorization.level = level;
    client.userId = id;

    sendToClient(client, {
      type: 'authorization',
      level
    });

    return { success: 'client elevated' }
  } else {
    return { error: 'client not found' }
  }
}