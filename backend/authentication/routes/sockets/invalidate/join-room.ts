/***** BASE IMPORTS *****/
import { z } from "zod";

/***** TYPE DEFINITIONS *****/
import type { SocketRouteCallback } from "shared/socket/type";
import type { Client } from "authentication/singleton";

/***** CONSTS *****/
import { ROUTES } from "../../../routes";

/***** VALIDATORS *****/
const validateJoinRoom = z.object({
  room: z.literal(ROUTES.SOCKETS.INVALIDATE.JOIN_ROOM),
  endpoint: z.string()
})

/***** HANDLERS *****/
const _handler: SocketRouteCallback<typeof validateJoinRoom, Client> = ({ data, client }) => {
  client.rooms.add(`invalidate/${data.endpoint}`);
}

/***** EXPORTS *****/
export const joinRoomSocketHandler = Object.assign(_handler, {
  validate: validateJoinRoom
})
