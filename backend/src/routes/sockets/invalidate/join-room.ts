/***** BASE IMPORTS *****/
import { z } from "zod";

/***** TYPE DEFINITIONS *****/
import type { TSocketRouteCallback } from "../../../socket/store/types";

/***** CONSTS *****/
import { ROUTES } from "../../../route-names";

/***** VALIDATORS *****/
const validateJoinRoom = z.object({
  room: z.literal(ROUTES.SOCKETS.INVALIDATE.JOIN_ROOM),
  endpoint: z.string()
})

/***** HANDLERS *****/
const _handler: TSocketRouteCallback<typeof validateJoinRoom> = ({ data, client }) => {
  client.rooms.add(`invalidate/${data.endpoint}`);
}

/***** EXPORTS *****/
export const joinRoomSocketHandler = Object.assign(_handler, {
  validate: validateJoinRoom
})
