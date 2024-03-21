import { z } from "zod";
import { ROOMS, TSocketTypes, TYPES } from "./static";

/***** VALIDATORS *****/
const roomsValidators = {
  [TYPES.SERVER_CONNECTION]: z.array(z.never()),
  [TYPES.AUTHORIZATION]: z.array(z.never()),
  [TYPES.INVALIDATE]: z.array(z.union([
    z.literal(ROOMS[TYPES.INVALIDATE].ENDPOINT_A),
    z.literal(ROOMS[TYPES.INVALIDATE].ENDPOINT_B),
    z.literal(ROOMS[TYPES.INVALIDATE].EXAMPLE),
  ])),
  [TYPES.ROOMS]: z.array(z.union([
    z.literal(ROOMS[TYPES.ROOMS].INVALIDATE_ENDPOINT_A),
    z.literal(ROOMS[TYPES.ROOMS].INVALIDATE_ENDPOINT_B),
    z.literal(ROOMS[TYPES.ROOMS].INVALIDATE_EXAMPLE),
  ]))
}

/***** EXPORTS *****/
export const socketValidators = {
  typeValidator: z.object({
    type: z.union([
      z.literal(TYPES.SERVER_CONNECTION),
      z.literal(TYPES.INVALIDATE),
      z.literal(TYPES.ROOMS),
      z.literal(TYPES.AUTHORIZATION),
    ]),
  }),
  serverConnection: z.object({
    type: z.literal(TYPES.SERVER_CONNECTION),
    identifier: z.string(),
    rooms: roomsValidators[TYPES.SERVER_CONNECTION],
    authorization: z.object({
      level: z.union([
        z.literal('guest'),
        z.literal('user'),
        z.literal('admin'),
      ])
    })
  }),
  invalidate: z.object({
    type: z.literal(TYPES.INVALIDATE),
    rooms: roomsValidators[TYPES.INVALIDATE]
  }),
  rooms: z.object({
    type: z.literal(TYPES.ROOMS),
    rooms: roomsValidators[TYPES.ROOMS]
  }),
  authorization: z.object({
    type: z.literal(TYPES.AUTHORIZATION),
    level: z.union([
      z.literal('guest'),
      z.literal('user'),
      z.literal('admin'),
    ])
  })
} as const;

export const simpleParse: TSocketTypes.TSimpleParse = (callback) => (message) => {
  const parsed = socketValidators.typeValidator.safeParse(message)

  if (!parsed.success)
    return;

  callback(parsed.data)
}
