/***** CONSTANTS *****/
import { wsServer } from "authentication/singleton";

/***** TYPE DEFINITIONS *****/
import type { User } from "prisma/generated/auth";

/***** COMPONENT START *****/
export const elevateClient = (clientId: string, { id }: User) => {
  const client = wsServer.client.byIdentifier(clientId)

  if (!client)
    return { error: 'client not found' }

  client.authorization.level = 'user';
  client.userId = id;
  client.send({
    type: 'authorization',
    level: client.authorization.level
  });

  return { success: 'client elevated' }
}