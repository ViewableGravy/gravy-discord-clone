import { z } from "zod"
import { socketValidators } from "./validators"

/***** TYPE DEFINITIONS *****/
export namespace TSocketTypes {
  /**
   * Validator return types
  */
  export type TSimpleMessage = z.infer<typeof socketValidators.typeValidator>
  export type TServerConnectionMessage = z.infer<typeof socketValidators.serverConnection>

  /**
   * Individual room types
   */
  export type TInvalidateRooms = `${typeof TYPES.INVALIDATE}/${ValueOf<typeof ROOMS[typeof TYPES.INVALIDATE]>}`
  export type TServerConnectionRooms = `${typeof TYPES.SERVER_CONNECTION}/${ValueOf<typeof ROOMS[typeof TYPES.SERVER_CONNECTION]>}`

  /**
   * List of rooms to store within the store, these should be from the formula `${type}/${room}`
   */
  export type TRooms = Array<TInvalidateRooms>
  export type TSimpleParse = (callback: (message: TSocketTypes.TSimpleMessage) => void) => (message: MessageEvent<any>) => void;


  export namespace Send {
    type TJoinRoom = {
      type: 'join-room',
      rooms: TSocketTypes.TRooms
    };

    type TLeaveRoom = {
      type: 'leave-room',
      rooms: TSocketTypes.TRooms
    };

    export type TSendMessage = TJoinRoom | TLeaveRoom;
  }
}

/***** CONSTS *****/
export const TYPES = {
  SERVER_CONNECTION: 'server-connection',
  INVALIDATE: 'invalidate',
  ROOMS: 'rooms'
} as const;

export const ROOMS = {
  [TYPES.SERVER_CONNECTION]: {},
  [TYPES.INVALIDATE]: {
    ENDPOINT_A: 'endpointA',
    ENDPOINT_B: 'endpointB',
    EXAMPLE: 'example'
  },
  [TYPES.ROOMS]: {
    INVALIDATE_ENDPOINT_A: 'invalidate/endpointA',
    INVALIDATE_ENDPOINT_B: 'invalidate/endpointB',
    INVALIDATE_EXAMPLE: 'invalidate/example'
  }
} as const;