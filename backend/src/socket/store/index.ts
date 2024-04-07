/***** BASE IMPORTS *****/
import { randomUUID } from "crypto";

/***** TYPE DEFINITIONS *****/
import type { TClient, TCreateMeProps } from "./types";
import type { INVALIDATE_ROOMS } from "../../models/enums";

class SocketManager {
  private store: Record<string, TClient> = {};

  constructor() {
    this.initiateCleanConnections();
  }

  initiateCleanConnections() {
    setInterval(() => {
      Object.values(this.store).forEach((client) => {
        if (client.ws.readyState === client.ws.CLOSED) {
          delete this.store[client.identifier];
        }
      });
    }, 10000);
  }

  createMe(props: TCreateMeProps) {
    const client: TClient = {
      identifier: randomUUID(),
      rooms: new Set(),
      authorization: {
        level: 'guest',
      },
      ...props,
    }

    this.initializeClient(client);

    this.store[client.identifier] = client;

    return client;
  }

  withMe(callback: (options: { me: TClient, ws: WebSocket }) => void) {
    return (ws: WebSocket) => {
      const me = this.createMe({ ws });

      callback({ me, ws });
    }
  }

  sendToClient(client: TClient, message: any) {
    client.ws.send(JSON.stringify(message));
  }

  getClientById(id: string) {
    return this.store[id];
  }

  getClientsInRoom(room: string) {
    return Object.values(this.store).filter(client => client.rooms.has(room));
  }

  announceRoomsToClient(client: TClient) {
    client.ws.send(JSON.stringify({
      type: 'rooms',
      rooms: Array.from(client.rooms),
    }));
  }

  initializeClient(client: TClient) {
    client.ws.send(JSON.stringify({
      type: 'server-connection',
      rooms: Array.from(client.rooms),
      authorization: client.authorization,
      identifier: client.identifier,
    }))
  }

  invalidateRooms(rooms: Array<ValueOf<typeof INVALIDATE_ROOMS>>) {
    Object.values(this.store).forEach((client) => {
      const invalidatedRooms = rooms.filter(room => client.rooms.has(`invalidate/${room}`));

      if (invalidatedRooms.length > 0) {
        client.ws.send(JSON.stringify({
          type: 'invalidate',
          rooms: invalidatedRooms,
        }));
      }
    })
  }

  getStore() {
    return this.store;
  }
  
}

export const socketManager = new SocketManager();
