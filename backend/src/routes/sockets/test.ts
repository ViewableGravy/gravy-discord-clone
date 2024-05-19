/***** BASE IMPORTS *****/
import { z } from "zod";

/***** TYPE DEFINITIONS *****/
import type { SocketRouteCallback } from "src/socket_new/type";
import type { Client } from "src/singleton";

/***** VALIDATORS *****/
const validateSocketTest = z.object({
  room: z.literal('room/test'),
  message: z.string()
})

/***** HANDLERS *****/
const _handler: SocketRouteCallback<typeof validateSocketTest, Client> = ({ data }) => {
  console.log("we made it!:", data)
}

/***** EXPORTS *****/
export const testSocketHandler = Object.assign(_handler, {
  validate: validateSocketTest
})