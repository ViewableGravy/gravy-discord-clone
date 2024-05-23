// import type { z } from "zod";
// import type { baseValidators } from "../../validators/socket/base";
// import { socketValidators } from "../../validators/socket/rooms";
// // import type { TClient } from "../store/types";
// // import { socketManager } from "../store";

// /***** TYPE DEFINITIONS *****/
// type THandleJoinRoomProps = {
//   message: z.infer<typeof socketValidators['join-room']>;
//   me: TClient;
// }

// type THandleLeaveRoomProps = {
//   message: z.infer<typeof socketValidators['leave-room']>;
//   me: TClient;
// }

// type THandleJoinRoom = (props: THandleJoinRoomProps) => void;
// type THandleLeaveRoom = (props: THandleLeaveRoomProps) => void;

// /***** HANDLERS *****/
// const handleJoinRoom: THandleJoinRoom = ({ me, message }) => {
//   message.rooms.forEach((room) => {
//     me.rooms.add(room);
//   })

//   socketManager.announceRoomsToClient(me)
// }

// const handleLeaveRoom: THandleLeaveRoom = ({ me, message }) => {
//   message.rooms.forEach((room) => {
//     me.rooms.delete(room);
//   })

//   socketManager.announceRoomsToClient(me)
// }

// /***** EXPORTS *****/
// export const generateHandleRoom = (me: TClient) => {
//   return (message: z.infer<typeof baseValidators.base>) => {
//     const validated = socketValidators[message.type].parse(message);

//     switch (validated.type) {
//       case 'join-room':
//         return handleJoinRoom({ 
//           message: validated, 
//           me, 
//         });
//       case 'leave-room':
//         return handleLeaveRoom({ 
//           message: validated,
//           me, 
//         });
//     }
//   }
// }