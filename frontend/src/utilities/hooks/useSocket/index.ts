import { useStore } from "@tanstack/react-store";
import { AuthSocket } from "./authSocket";

type TUseSocket = TUseSpecificStore<TCustomStore<typeof authSocket.store>, {
  joinRoom: typeof authSocket.joinRoom,
  leaveRoom: typeof authSocket.leaveRoom,
  useJoinRoomEffect: typeof authSocket.useJoinRoomEffect,
}>

export const authSocket = new AuthSocket({
  socket: null,
  rooms: [],
  identifier: null,
  readyState: null,
  retryAttempts: 0,
  reconnectTime: null,
  authorization: {
    level: null,
  }
});

/**
 * This hook provides a set of standard methods to interact with the socket shared for the application. This includes joining "rooms", sending messages, and listening for messages.
 */
export const useSocket: TUseSocket = (selector = (s) => s as any) => {
  const state = useStore(authSocket.store, selector)

  return {
    joinRoom: authSocket.joinRoom,
    leaveRoom: authSocket.leaveRoom,
    useJoinRoomEffect: authSocket.useJoinRoomEffect,
    isAuthenticated: authSocket.isAuthenticated,
    ...state
  }
};