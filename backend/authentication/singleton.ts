/***** BASE IMPORTS *****/
import express from 'express';

/***** SOCKET IMPORTS *****/
import { generateSocketServer } from '../shared/socket';
import { randomUUID } from 'crypto';

/***** TYPE DEFINITIONS *****/
import type { BaseClient, inferClient } from '../shared/socket/type';

export type Client = BaseClient & {
  authorization: {
    level: 'guest' | 'user' | 'admin',
  },
  userId?: string
}

const socketStore: Record<string, Client> = {};

/***** EXPORTS *****/
export const server =  express();
export const wsServer = generateSocketServer({
  direction: 'server',
  generateIdentifier() {
    return randomUUID()
  },
  store: {
    read(identifier) {
      return socketStore[identifier]
    },
    create(client) {
      socketStore[client.identifier] = {
        ...client,
        authorization: {
          level: 'guest'
        }
      };
    },
    update(identifier, client) {
      socketStore[identifier] = client;
    },
    delete(identifier) {
      if (socketStore[identifier]) {
        delete socketStore[identifier];
      }
    },
    raw() {
      return socketStore;
    }
  },
  initializeClient(base) {
    return {
      ...base,
      authorization: {
        level: 'guest'
      }
    }
  },
  dependencies: {
    builder(client) {
      return ({ status }) => {
        client.send({ status });
      }
    }
  }
})

/**
 * Type can be inferred from the store if necessary
 */
type SocketClient = inferClient<typeof wsServer>
