import { z } from "zod";
import { getTypeLiteral } from "./base";
import { ROOMS } from "../../models/enums";

type TSocketValidators = {
  'join-room': any,
  'leave-room': any,
}

const roomUnion = z.union([
  z.literal(ROOMS.INVALIDATE_ENDPOINT_A),
  z.literal(ROOMS.INVALIDATE_ENDPOINT_B),
  z.literal(ROOMS.INVALIDATE_EXAMPLE),
])

export const socketValidators = {
  "join-room": z.object({
    type: getTypeLiteral('join-room'),
    rooms: z.array(roomUnion)
  }),
  "leave-room": z.object({
    type: getTypeLiteral('leave-room'),
    rooms: z.array(roomUnion)
  }),
} satisfies TSocketValidators;