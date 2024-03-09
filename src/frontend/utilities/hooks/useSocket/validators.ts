import { ZodAny, ZodObject, ZodSchema, ZodType, z } from "zod";

const simpleMessageValidator = z.object({
  type: z.union([
    z.literal('server-connection'),
    z.literal('invalidate/example'),
    z.literal('invalidate/example2'),
  ]),
})

const serverConnectionMessageValidator = z.object({
  type: z.literal('server-connection'),
  identifier: z.string(),
  rooms: z.array(z.string()).length(0)
})

export const socketValidators = {
  simpleMessageValidator,
  serverConnectionMessageValidator
} as const;

export namespace TSocketValidators {
  export type TSimpleMessage = z.infer<typeof simpleMessageValidator>
  export type TServerConnectionMessage = z.infer<typeof serverConnectionMessageValidator>
}

type TSimpleParse = (callback: (message: TSocketValidators.TSimpleMessage) => void) => (message: MessageEvent<any>) => void;
export const simpleParse: TSimpleParse = (callback) => (message) => {
  const parsed = socketValidators.simpleMessageValidator.safeParse(message)

  if (!parsed.success)
    return;

  callback(parsed.data)
}
