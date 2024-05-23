// /***** BASE IMPORTS *****/
// import { z } from 'zod';
// import { WebSocketServer as _WebSocketServer } from 'ws';
// import { randomUUID } from 'crypto';

// /***** TYPE DEFINITIONS *****/
// import type { Server } from 'http';
// import { log } from '../utilities/logging';

// type TAuthorizationLevels = 'guest' | 'user' | 'admin';
// type TClient = {
//   identifier: string;
//   rooms: Set<string>;
//   ws: WebSocket;
//   authorization: {
//     level: TAuthorizationLevels;
//   },
//   userId?: string;
// }
// type TCreateMeProps = Partial<Omit<TClient, 'ws'>> & { ws: WebSocket; }

// type TCreateUserArgs = Partial<Omit<TClient, 'ws'>> & { ws: WebSocket; }
// type TUnidentifiedClient = {
//   ws: WebSocket;
//   awaitingIdentification: true;
//   send: (data: any) => void;
// }

// //new
// type WebSocketClient = {
//   identifier: string;
//   rooms: Set<string>;
//   ws: WebSocket;
//   send: (data: any) => void;
// }

// type TSocketHandlerArgs<Validator extends z.AnyZodObject> = {
//   data: z.infer<Validator>,
//   client: WebSocketClient,
//   builder: (client: WebSocketClient) => void
// }

// type TSocketRouteCallback<Validator extends z.AnyZodObject> = (args: TSocketHandlerArgs<Validator>) => void;

// type TCustomClient<T> = NoInfer<T> & WebSocketClient;

// type WebSocketServerBaseProps<
//   TExtendedClient extends Record<string, any>, 
//   TClient extends TCustomClient<TExtendedClient>
// > = {
//   /**
//    * The source of identification for the client.
//    */
//   identificationSource?: "client" | "server";

//   /**
//    * Optional callback to generate additional data to send to the client when the connection is first initiated. This can be some extra default
//    * information such as an authorization level or other applicable information for the client relating to the socket session
//    */
//   onInitializeClient?: (client: NoInfer<TClient>) => Record<string, any>;

//   /**
//    * An object representing the default values of the client. This object is merged with the client object when the client is first created and helps to
//    * provide an extensible client object that can be used to store additional information about the client.
//    */
//   extended?: TExtendedClient;
// }

// type WebSocketServerClientSourceProps = {
//   /**
//    * The source of identification for the client.
//    */
//   identificationSource: "client";

//   /**
//    * When the identification source is the client, this function is called to verify the identification provided from the client.
//    * 
//    * In the context of the server, this function can make an API call to the server to verify the identity of the client and return
//    * whether the client is authorized to connect to the server. This function may also have side effects to store the client's information
//    * in this servers store.
//    */
//   identificationVerfication: (identifier: string) => Promise<boolean>;
// }

// type WebSocketServerSourceProps = {
//   /**
//    * The source of identification for the client.
//    */
//   identificationSource: "server";

//   /**
//    * When the identification source is the server, this function is called to generate an identifier for the client.
//    * 
//    * This function should generate a unique identifier for the client that can be used to identify the client in the server's store.
//    * If this is not provided then a standard UUID will be generated for the client.
//    */
//   generateIdentifier?: (ws: WebSocket) => string;
// }

// type WebSocketServerProps<
//   TExtended extends Record<string, any>
// > = WebSocketServerBaseProps<TExtended, TCustomClient<TExtended>> & (WebSocketServerClientSourceProps | WebSocketServerSourceProps);

// class DiscordWebSocketServer<
//   TExtended extends Record<string, any>, 
//   TClient extends TCustomClient<TExtended>, 
//   TProps extends WebSocketServerProps<TExtended>
// > {
//   /***** STATE *****/
//   private store: Record<string, WebSocketClient> = {};
//   private routes: Record<string, (props: any) => void> = {};

//   /***** PROPS *****/
//   private identificationSource: NonNullable<TProps['identificationSource']>;
//   private generateIdentifier: NonNullable<WebSocketServerSourceProps['generateIdentifier']>;
//   private identificationVerfication: NonNullable<WebSocketServerClientSourceProps['identificationVerfication']>;
//   private extended: TExtended;
//   private customInitilizeClient: (client: TClient) => Record<string, any> = () => ({});
  
//   /***** SOCKET SERVER *****/
//   public socketServer = new _WebSocketServer({
//     noServer: true,
//   });

//   constructor(props: TProps) {
//     const { extended, onInitializeClient, identificationSource } = props;
//     const fallbackGenerateIdentifier = () => randomUUID();
    
//     if (props.identificationSource === "server") {
//       this.generateIdentifier = props.generateIdentifier ?? fallbackGenerateIdentifier;
//       this.identificationVerfication = () => Promise.resolve(true);
//     } else {
//       this.identificationVerfication = props.identificationVerfication;
//       this.generateIdentifier = fallbackGenerateIdentifier;
//     }
    
//     this.identificationSource = identificationSource;
//     this.extended = extended;
//     this.customInitilizeClient = onInitializeClient ?? this.customInitilizeClient;
//     this.socketServer.on('connection', this.onConnection);
//     this.cleanConnections();
//   }

//   /**
//    * A validation schema for the identification message sent by the client when first connecting to the server when the client is 
//    * the source of identification.
//    */
//   private validateIndentificationMessage = z.object({
//     type: z.literal('identification'),
//     identifier: z.string(),
//   });

//   /**
//    * A validation schema for the route message sent by the client when sending a message to the server. A route message is a message
//    * that lets the client send a message to a specific route on the server. This could be a subscription to a room, a message, or any
//    * other type of message that the server can handle. It behaves similar to a rest endpoint but using sockets.
//    */
//   private validateRouteMessage = z.object({
//     type: z.literal('route'),
//     route: z.string(),
//     body: z.unknown(),
//   });

//   private onConnection = (ws: WebSocket) => {
//     let client = this.createUser({ ws });
//     let builder: ReturnType<typeof this.generateBuilder>;

//     if (!('awaitingIdentification' in client)) {
//       builder = this.generateBuilder(client);
//     }

//     ws.on('message', async (msg) => {
//       const message = msg.toString();
      
//       if ('awaitingIdentification' in client) {
//         try {
//           const parsed = this.validateIndentificationMessage.parse(message);
//           const isAuthorized = await this.identificationVerfication(message)
          
//           if (!isAuthorized) {
//             ws.send(JSON.stringify({
//               type: 'error',
//               message: 'You are not authorized to connect to this server.',
//               canRetry: false,
//             }));

//             return ws.close();
//           }

//           client = {
//             identifier: parsed.identifier,
//             rooms: new Set<string>(),
//             send: (data) => ws.send(JSON.stringify(data)),
//             ws
//           }

//           builder = this.generateBuilder(client);
          
//           this.initializeClient(client)
//           return this.store[client.identifier] = client;
//         } catch (e) {
//           return ws.send(JSON.stringify({
//             type: 'error',
//             message: 'An error occurred while trying to connect to the server.',
//             canRetry: true,
//           }));
//         }
//       }

//       //parse route
//       const parsed = this.validateRouteMessage.safeParse(JSON.parse(message.toString()));

//       if (!parsed.success) {
//         return ws.send(JSON.stringify({
//           type: 'error',
//           message: 'Malformed request. You may try again',
//           request: message.toString(),
//           canRetry: true,
//         }));
//       }

//       const route = this.routes[parsed.data.route];

//       if (!route) {
//         return ws.send(JSON.stringify({
//           type: 'error',
//           message: 'Route not found',
//           route: parsed.data.route,
//           canRetry: false,
//         }));
//       }

//       return route({ 
//         client, 
//         builder,
//         body: parsed.data.body, 
//       });
//     })
//   }

//   private createUser = (args: TCreateMeProps) => {
//     if (this.identificationSource === "client") {
//       const client: TUnidentifiedClient = {
//         ws: args.ws,
//         awaitingIdentification: true,
//         send: (data) => args.ws.send(JSON.stringify(data)),
//       }

//       return client;
//     }

//     const client: TClient = {
//       identifier: this.generateIdentifier(args.ws),
//       rooms: new Set(),
//       ws: args.ws,
//       send: (data) => args.ws.send(JSON.stringify(data)),
//       ...this.extended
//     }

//     this.store[client.identifier] = client;
//     this.initializeClient(client);

//     return client;
//   }

//   private initializeClient(client: TClient) {
//     return client.ws.send(JSON.stringify({
//       type: 'server-connection',
//       rooms: Array.from(client.rooms),
//       identifier: client.identifier,
//       ...this.customInitilizeClient(client)
//     }))
//   }

//   // TODO: Implement this method
//   private generateBuilder(client: WebSocketClient) {
//     type TBuilderProps = {
//       status: 'success' | 'error';
//     }

//     return (options: TBuilderProps) => {
//       return client.ws.send(JSON.stringify(options));
//     }
//   }

//   private cleanConnections() {
//     setInterval(() => {
//       Object.values(this.store).forEach((client) => {
//         if (client.ws.readyState === client.ws.CLOSED) {
//           delete this.store[client.identifier];
//         }
//       });
//     }, 10000);
//   }

//   /***** PUBIC FUNCTIONS *****/
//   public route<TValidator extends z.AnyZodObject>(
//     route: string, 
//     validator: TValidator,
//     handler: TSocketRouteCallback<TValidator>
//   ) {
//     this.routes[route] = ({ client, body, builder }) => {
//       const validated = validator.safeParse(body);

//       if (!validated.success) {
//         log('INFO', `${client.identifier} sent a malformed request to ${route}`)
//         return builder({ error: validated.error });
//       }

//       return handler({ data: validated.data, client, builder });
//     }
//   }

//   public connect(route: string, server: Server) {
//     server.on('upgrade', (req, socket, head) => {    
//       if (req.url === route) {
//         this.socketServer.handleUpgrade(req, socket, head, (ws) => {
//           this.socketServer.emit('connection', ws, req);
//         })
//       }
//     })

//     log('INFO', `WebSocket server is connected to ${route}`);
//   }

//   public getClientByIdentifier(identifier: string) {
//     return this.store[identifier];
//   }

//   public getClientsByRoom(room: string) {
//     return Object.values(this.store).filter((client) => client.rooms.has(room));
//   }

// }