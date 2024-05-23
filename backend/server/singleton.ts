/***** BASE IMPORTS *****/
import express from 'express';

/***** SOCKET IMPORTS *****/
import { generateSocketServer } from 'shared/socket';
import { randomUUID } from 'crypto';

/***** TYPE DEFINITIONS *****/
import type { BaseClient } from '../shared/socket/type';

export type Client = BaseClient & {
  // extra fields not stored by the BaseClient
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
      socketStore[client.identifier] = client;
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
    return base
  },
  dependencies: {
    builder(client) {
      return ({ status }) => {
        client.send({ status });
      }
    }
  }
})
