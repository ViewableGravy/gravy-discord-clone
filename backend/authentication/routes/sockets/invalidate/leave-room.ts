/***** BASE IMPORTS *****/
import { z } from "zod";

/***** TYPE DEFINITIONS *****/
import type { SocketRouteCallback } from "shared/socket/type";
import type { Client } from "authentication/singleton";

/***** CONSTS *****/
import { ROUTES } from "../../../routes";


/***** VALIDATORS *****/
const validateJoinRoom = z.object({
  room: z.literal(ROUTES.SOCKETS.INVALIDATE.LEAVE_ROOM),
  endpoint: z.string()
})

/***** HANDLERS *****/
const _handler: SocketRouteCallback<typeof validateJoinRoom, Client> = ({ data, client }) => {
  client.rooms.delete(`invalidate/${data.endpoint}`);
}

/***** EXPORTS *****/
export const leaveRoomSocketHandler = Object.assign(_handler, {
  validate: validateJoinRoom
})
