/***** BASE IMPORTS *****/
import { z } from "zod";

/***** TYPE DEFINITIONS *****/
import type { TSocketRouteCallback } from "../../socket/store/types";

/***** VALIDATORS *****/
const validateSocketTest = z.object({
  room: z.literal('room/test'),
  message: z.string()
})

/***** HANDLERS *****/
const _handler: TSocketRouteCallback<typeof validateSocketTest> = ({ data }) => {
  console.log("we made it!:", data)
}

/***** EXPORTS *****/
export const testSocketHandler = Object.assign(_handler, {
  validate: validateSocketTest
})