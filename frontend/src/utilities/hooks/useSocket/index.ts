import { Store, useStore } from "@tanstack/react-store";
import { useCallback } from "react";
import { RouteHandlers } from "./handlers";
import { socketValidators } from "./validators";
import { TSocketTypes } from "./static";

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

/**
 * This to manage socket connection. This should not directly
 * be used but instead use the useSocket hook.
 */
export const _socketStore = new Store<{
  socket: WebSocket | null,
  rooms: TSocketTypes.TRooms,
  identifier: string | null,
  readyState: 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'ERROR' | 'RECONNECTING' | 'READY' | null,
  retryAttempts: number,
  reconnectTime: Date | null,
  authorization: {
    level: null | 'guest' | 'user' | 'admin',
  }
}>(defaultStoreState)

/**
 * This hook provides a set of standard methods to interact with the socket shared for the application. This includes joining "rooms", sending messages, and listening for messages.
 */
export const useSocket = () => {
  const { rooms, socket, ...rest } = useStore(_socketStore)

  const send = useCallback((message: TSocketTypes.Send.TSendMessage) => {
    const stringified = JSON.stringify(message);
    socket?.send(stringified)
  }, [socket])
  
  const joinRoom = useCallback((_rooms: TSocketTypes.TRooms) => {
    const newRooms = _rooms.filter((room) => !rooms.includes(room));

    if (newRooms.length) {
      send({
        type: 'join-room',
        rooms: newRooms
      })
    }
  }, [send, rooms])

  const leaveRoom = useCallback((_rooms: TSocketTypes.TRooms) => {
    const removingRooms = _rooms.filter((room) => rooms.includes(room));

    if (removingRooms.length) {
      send({
        type: 'leave-room',
        rooms: removingRooms
      })
    }
  }, [send, rooms])

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

    if (_socketStore.state.reconnectTime && _socketStore.state.reconnectTime > new Date()) {
      return;
    } 

    _socketStore.setState((state) => { 
      const { retryAttempts } = state;
      const timeout = Math.min(30000, Math.pow(2, retryAttempts || 1) * 1000);

      setTimeout(connect, timeout);

      return {
        ...defaultStoreState, 
        retryAttempts: retryAttempts + 1,
        reconnectTime: new Date(Date.now() + timeout)
      }
    })
  }

  type SimpleParse = (
    callback: (message: TSocketTypes.TSimpleMessage) => void
  ) => (message: MessageEvent<any>) => void;
  
  const simpleParse: SimpleParse = (callback) => (message) => {
    const parsed = socketValidators.typeValidator.safeParse(message)
  
    if (!parsed.success)
      return;
  
    callback(parsed.data)
  }
  
  socket.addEventListener('close', handleReconnect)
  socket.addEventListener('error', handleReconnect)
  socket.addEventListener('message', simpleParse((message) => RouteHandlers[message.type](message)))
  socket.addEventListener('open', () => {
    _socketStore.setState((state) => ({ 
      ...state, 
      readyState: READY_STATE[socket.readyState] ?? 'ERROR',  
    }))
  })

  _socketStore.setState((state) => ({ ...state, socket }))
}

/**
 * Connect to the socket on app start. Note that by default, you can connect
 * without any authentication information and will have a permission level of
 * "guest"
 */
connect();
