import { z, ZodType } from "zod";
import { socketValidators } from "./validators";
import { _socketStore } from ".";
import { TSocketTypes } from "./static";
import { queryClient } from "../../../main";

type TVoidParse = <T extends ZodType<any, any, any>>(parser: T, callback: (message: z.infer<T>) => void) => (message: any) => void;
type THandlers = Record<TSocketTypes.TSimpleMessage['type'], (message: TSocketTypes.TSimpleMessage) => void>

/**
 * Helper function that takes a parser and callback, where the callback will be invoked if the parser is successful.
 * This function will return a function that takes a message in the standard format { type: string } for use in the handlers object
 * 
 * If the parse fails, the function performs a noop (this can be updated in the future to notify the backend of the failure)
 */
export const voidParse: TVoidParse = (parser, callback) => (message) => {
  const parsed = parser.safeParse(message)

  if (!parsed.success) {
    if (import.meta.env.DEV) {
      console.log(parsed.error)
    }

    return;
  }

  callback(parsed.data)
}

/**
 * Mapping of "Route Handlers". Given the key (type) of a message, the function will handle the message, performing the necessary actions
 * or if the message has rooms, perform the necessary actions for the rooms on the route handler.
 * 
 * Example: RouteHandlers.invalidate will invalidate each Tanstack query that is in the rooms array of the message.
 */
export const RouteHandlers: THandlers = {
  "server-connection": voidParse(socketValidators.serverConnection, ({ identifier, authorization }) => {
    _socketStore.setState((state) => ({ 
      ...state, 
      readyState: 'READY',
      rooms: [],
      identifier, 
      authorization
    }))
  }),
  "rooms": voidParse(socketValidators.rooms, ({ rooms }) => {
    _socketStore.setState((state) => ({
      ...state,
      rooms
    }))
  }),
  'invalidate': voidParse(socketValidators.invalidate, ({ rooms }) => {
    //In this context, rooms are the names of the Tanstack query keys (the query keys should be based off rooms in the backend)
    rooms.forEach((room) => {
      queryClient.invalidateQueries({ 
        queryKey: [room]
      })
    })
  }),
  'authorization': voidParse(socketValidators.authorization, ({ level }) => {
    console.log('level')
    _socketStore.setState((state) => ({
      ...state,
      authorization: {
        level
      }
    }))
  })
}
