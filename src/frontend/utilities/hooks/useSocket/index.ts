import { Store, useStore } from "@tanstack/react-store";
import { useCallback } from "react";
import { handlers } from "./handlers";
import { TSocketValidators, socketValidators } from "./validators";

type TInvalidationRoom = 'invalidate/example'

export type TRoom = TInvalidationRoom

const defaultStoreState = {
  socket: null,
  rooms: [],
  identifier: null,
  readyState: null,
  retryAttempts: 0,
  reconnectTime: null,
  authorization: {
    level: null,
  }
}

const socketStore = new Store<{
  socket: WebSocket | null,
  rooms: TRoom[],
  identifier: string | null,
  readyState: 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'ERROR' | 'RECONNECTING' | null,
  retryAttempts: number,
  reconnectTime: Date | null,
  authorization: {
    level: null,
  }
}>(defaultStoreState)

/**
 * This hook provides a set of standard methods to interact with the socket shared for the application. This includes joining "rooms", sending messages, and listening for messages.
 */
export const useSocket = () => {
  const { rooms } = useStore(socketStore, ({ rooms }) => ({
    rooms
  }))
  
  const joinRoom = useCallback((room: TRoom) => {
    if (rooms.includes(room))
      return

    // Add room to the list of rooms

  }, [])

  const leaveRoom = useCallback((room: TRoom) => {
    if (!rooms.includes(room))
      return

    // Remove room from the list of rooms

  }, [])

  return {
    joinRoom,
    leaveRoom
  }
};

/***** IMMEDIATE FUNCTIONALITY *****/
const url = new URL('ws://localhost:3000')
const READY_STATE: Record<number, 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'> = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED'
}

const connect = () => {
  const socket = new WebSocket(url)

  const handleReconnect = () => {
    socket.close()
    socketStore.setState((state) => { 
      const { retryAttempts } = state;
      const timeout = Math.min(30000, Math.pow(2, retryAttempts) * 1000);

      setTimeout(connect, timeout);

      return {
        ...defaultStoreState, 
        retryAttempts: retryAttempts + 1,
        reconnectTime: new Date(Date.now() + timeout)
      }
    })
  }

  type SimpleParse = (
    callback: (message: TSocketValidators.TSimpleMessage) => void
  ) => (message: MessageEvent<any>) => void;
  
  const simpleParse: SimpleParse = (callback) => (message) => {
    const parsed = socketValidators.simpleMessageValidator.safeParse(message)
  
    if (!parsed.success)
      return;
  
    callback(parsed.data)
  }
  
  socket.addEventListener('close', handleReconnect)
  socket.addEventListener('error', handleReconnect)
  socket.addEventListener('message', simpleParse((message) => handlers[message.type](message)))
  socket.addEventListener('open', () => {
    socketStore.setState((state) => ({ 
      ...state, 
      readyState: READY_STATE[socket.readyState] ?? 'ERROR',  
    }))
  })

  socketStore.setState((state) => ({ ...state, socket }))
}

connect();
