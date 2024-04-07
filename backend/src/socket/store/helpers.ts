/***** BASE IMPORTS *****/
import { randomUUID } from "crypto";

/***** STATE *****/
import { socketStore } from "../store/store";

/***** TYPE DEFINITIONS *****/
import type { TClient, TCreateMeProps } from "./types";
import type { INVALIDATE_ROOMS } from "../../models/enums";

/***** INTERVALS *****/
setInterval(() => {
  // remove closed connections
  Object.values(socketStore.clients).forEach((client) => {
    if (client.ws.readyState === client.ws.CLOSED) {
      delete socketStore.clients[client.identifier];
    }
  });
}, 10000);

/***** HELPER FUNCTIONS *****/
const createMe = (props: TCreateMeProps) => {
  const client: TClient = {
    identifier: randomUUID(),
    rooms: new Set(),
    authorization: {
      level: 'guest',
    },
    ...props,
  }

  initializeClient(client);

  socketStore.clients[client.identifier] = client;

  return client;
};

export const withMe = (callback: (options: { me: TClient, ws: WebSocket }) => void) => {
  return (ws: WebSocket) => {
    const me = createMe({ ws });

    callback({ me, ws });
  }
}

export const sendToClient = (client: TClient, message: any) => {
  client.ws.send(JSON.stringify(message));
} 

export const getClientById = (id: string) => {
    return socketStore.clients[id];
}

export const getClientsInRoom = (room: string) => {
  return Object.values(socketStore.clients).filter(client => client.rooms.has(room));
}

export const announceRoomsToClient = (client: TClient) => {
  client.ws.send(JSON.stringify({
    type: 'rooms',
    rooms: Array.from(client.rooms),
  }));
}

export const initializeClient = (client: TClient) => {
  client.ws.send(JSON.stringify({
    type: 'server-connection',
    rooms: Array.from(client.rooms),
    authorization: client.authorization,
    identifier: client.identifier,
  }))
}

export const invalidateRooms = (rooms: Array<ValueOf<typeof INVALIDATE_ROOMS>>) => {
  Object.values(socketStore.clients).forEach((client) => {
    const invalidatedRooms = rooms.filter(room => client.rooms.has(`invalidate/${room}`));

    if (invalidatedRooms.length > 0) {
      client.ws.send(JSON.stringify({
        type: 'invalidate',
        rooms: invalidatedRooms,
      }));
    }
  })
}