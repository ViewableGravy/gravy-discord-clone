/***** BASE IMPORTS *****/
import { z } from "zod";

/***** TYPE DEFINITIONS *****/
import type { TSocketRouteCallback } from "../../../socket/store/types";

/***** CONSTS *****/
import { ROUTES } from "../../../route-names";


/***** VALIDATORS *****/
const validateJoinRoom = z.object({
  room: z.literal(ROUTES.SOCKETS.INVALIDATE.LEAVE_ROOM),
  endpoint: z.string()
})

/***** HANDLERS *****/
const _handler: TSocketRouteCallback<typeof validateJoinRoom> = ({ data, client }) => {
  client.rooms.delete(`invalidate/${data.endpoint}`);
}

/***** EXPORTS *****/
export const leaveRoomSocketHandler = Object.assign(_handler, {
  validate: validateJoinRoom
})
