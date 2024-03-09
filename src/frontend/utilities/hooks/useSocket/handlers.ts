import { z, ZodType } from "zod";
import { socketValidators, TSocketValidators } from "./validators";

type TVoidParse = <T extends ZodType<any, any, any>>(parser: T, callback: (message: z.infer<T>) => void) => (message: { type: string }) => void;
type THandlers = Record<TSocketValidators.TSimpleMessage['type'], (message: TSocketValidators.TSimpleMessage) => void>

/**
 * Helper function that takes a parser and callback, where the callback will be invoked if the parser is successful.
 * This function will return a function that takes a message in the standard format { type: string } for use in the handlers object
 * 
 * If the parse fails, the function performs a noop
 */
const voidParse: TVoidParse = (parser, callback) => (message) => {
  const parsed = parser.safeParse(message)

  if (!parsed.success)
    return;

  callback(parsed.data)
}


export const handlers: THandlers = {
  "server-connection": voidParse(socketValidators.serverConnectionMessageValidator, (message) => {

  }),
  'invalidate/example': (_: unknown) => void 0,
  "invalidate/example2": (_: unknown) => void 0
}

voidParse(socketValidators.serverConnectionMessageValidator, (message) => {});
