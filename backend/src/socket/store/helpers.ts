import { randomUUID } from "crypto";
import { socketStore } from "../store/store";
import type { TAuthorizationLevels, TClient, TCreateMeProps } from "./types";
import type { INVALIDATE_ROOMS } from "../../models/enums";
import type { User } from "@prisma/client";

/***** INTERVALS *****/
setInterval(() => {
  // remove closed connections
  socketStore.clients.forEach(({ ws, identifier }) => {
      if (ws.readyState === ws.CLOSED) {
          const index = socketStore.clients.findIndex(x => x.identifier === identifier);
          socketStore.clients.splice(index, 1);
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

  socketStore.clients.push(client);

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
  return socketStore.clients.find(client => client.identifier === id);
}

export const getClientsInRoom = (room: string) => {
  return socketStore.clients.filter(client => client.rooms.has(room));
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
  socketStore.clients.forEach((client) => {
    const invalidatedRooms = rooms.filter(room => client.rooms.has(`invalidate/${room}`));

    if (invalidatedRooms.length > 0) {
      client.ws.send(JSON.stringify({
        type: 'invalidate',
        rooms: invalidatedRooms,
      }));
    }
  })
}