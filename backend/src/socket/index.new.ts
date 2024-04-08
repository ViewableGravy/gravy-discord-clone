import { WebSocketServer as _WebSocketServer } from 'ws';
import type { TClient, TCreateMeProps, TUnidentifiedClient } from './store/types';
import { randomUUID } from 'crypto';
import type { z } from 'zod';

type WebSocketServerProps = {
  /**
   * The source of identification for the client.
   */
  identificationSource?: "client" | "server";
}

class DiscordWebSocketServer {
  private store: Record<string, TClient> = {};
  private routes: Record<string, (props: any) => void> = {};
  private identificationSource: NonNullable<WebSocketServerProps['identificationSource']>;
  private socketServer = new _WebSocketServer({
    noServer: true,
  });

  constructor({ identificationSource = "server" }: WebSocketServerProps) {
    this.identificationSource = identificationSource;
  }

  createUser(args: TCreateMeProps) {
    if (this.identificationSource === "server") {
      const client: TUnidentifiedClient = {
        ws: args.ws,
        awaitingIdentification: true,
      }

      return client;
    }

    const client: TClient = {
      identifier: randomUUID(),
      rooms: new Set(),
      authorization: {
        level: 'guest',
      },
      ...args,
    }

    this.initializeClient(client);
    this.store[client.identifier] = client;

    return client;
  }

  initializeClient(client: TClient) {
    client.ws.send(JSON.stringify({
      type: 'server-connection',
      rooms: Array.from(client.rooms),
      authorization: client.authorization,
      identifier: client.identifier,
    }))
  }

  route<TValidator extends z.AnyZodObject>(
    route: string, 
    validator: TValidator,
    handler: (props: z.infer<TValidator>) => ReturnType<ReturnType<typeof this.generateBuilder>>
  ) {
    this.routes[route] = ({ client, body, builder }) => {
      const validated = validator.safeParse(body);

      if (!validated.success) {
        return builder({ error: validated.error });
      }

      return handler({ data: validated.data, client, builder });
    }
  }

  // TODO: Implement this method
  private generateBuilder(client: TClient) {
    return (options: unknown) => {
      return {}
    }
  }

}