import { Store } from "@tanstack/react-store"
import { READY_STATE, url, type TSocketTypes } from "./static";
import { socketValidators } from "./validators";
import { RouteHandlers } from "./handlers";
import { useEffect } from "react";

type TStore = {
  socket: WebSocket | null,
  rooms: TSocketTypes.TRooms,
  identifier: string | null,
  readyState: 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'ERROR' | 'RECONNECTING' | 'READY' | null,
  retryAttempts: number,
  reconnectTime: Date | null,
  authorization: {
    level: null | 'guest' | 'user' | 'admin',
  }
}

export class AuthSocket {
  private defaultStore: TStore;
  public store: Store<TStore>;

  constructor(_default: TStore) {
    this.store = new Store(_default)
    this.defaultStore = _default;
    this.connect()
  }

  connect = () => {
    const socket = new WebSocket(url)
  
    const handleReconnect = () => {
      socket.close()
  
      if (this.store.state.reconnectTime && this.store.state.reconnectTime > new Date()) {
        return;
      } 
  
      this.store.setState((state) => { 
        const { retryAttempts } = state;
        const timeout = Math.min(30000, Math.pow(2, retryAttempts || 1) * 1000);
  
        setTimeout(this.connect, timeout);
  
        return {
          ...this.defaultStore, 
          retryAttempts: retryAttempts + 1,
          reconnectTime: new Date(Date.now() + timeout)
        }
      })
    }
  
    type SimpleParse = (
      callback: (message: TSocketTypes.TSimpleMessage) => void
    ) => (message: MessageEvent<any>) => void;
    
    const simpleParse: SimpleParse = (callback) => ({ data }) => {
      try {
        const parsed = JSON.parse(data);
        socketValidators.typeValidator.parse(parsed)

        callback(parsed)
      } catch (e) {
      }
    }
    
    socket.addEventListener('close', handleReconnect)
    socket.addEventListener('error', handleReconnect)
    socket.addEventListener('message', simpleParse((message) => RouteHandlers[message.type](message)))
    socket.addEventListener('open', () => {
      this.store.setState((state) => ({ 
        ...state, 
        retryAttempts: 0,
        reconnectTime: null,
        readyState: READY_STATE[socket.readyState] ?? 'ERROR',  
      }))
    })
  
    this.store.setState((state) => ({ ...state, socket }))
  }

  send = (message: TSocketTypes.Send.TSendMessage) => {
    const stringified = JSON.stringify(message);
    this.store.state.socket?.send(stringified)
  }

  joinRoom = (_rooms: TSocketTypes.TRooms) => {
    const newRooms = _rooms.filter((room) => !this.store.state.rooms.includes(room));
  
    if (newRooms.length) {
      this.send({
        type: 'join-room',
        rooms: newRooms
      })
    }
  }

  leaveRoom = (_rooms: TSocketTypes.TRooms) => {
    const removingRooms = _rooms.filter((room) => this.store.state.rooms.includes(room));
  
    if (removingRooms.length) {
      this.send({
        type: 'leave-room',
        rooms: removingRooms
      })
    }
  }

  useJoinRoomEffect = (rooms: TSocketTypes.TRooms, dependencies: React.DependencyList) => {
    useEffect(() => {
      if (this.store.state.readyState === 'READY') {
        this.joinRoom(rooms)
      }
    }, dependencies)
  }

  isAuthenticated = (minimumLevel: 'guest' | 'user' | 'admin' = 'user') => {
    const levels = ['guest', 'user', 'admin'] as const;
    const level = this.store.state.authorization.level;
  
    if (!level) {
      return false;
    }
  
    return levels.indexOf(level) >= levels.indexOf(minimumLevel)
  }
}