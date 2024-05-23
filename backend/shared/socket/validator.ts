import { z } from "zod";


export const socketServerValidators = {
  route: z.object({
    type: z.literal('route'),
    route: z.string(),
    body: z.unknown(),
  })
}

type test = z.infer<typeof socketServerValidators.route>