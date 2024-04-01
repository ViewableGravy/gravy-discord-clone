/***** BASE IMPORTS *****/
import { z } from "zod";
import { randomBytes } from "crypto";

/***** MODELS *****/
import { createRouteCallback } from "../../models/base";

/***** UTILITIES *****/
import { elevateClient } from "../../socket/events/elevateClient";
import { createJWT, validatePassword } from "../../utilities/crypto";
import { createSession } from "./helpers/createSession";

/***** VALIDATION *****/
const validator = z.object({
  username: z.string(),
  password: z.string(),
  id: z.string().nullable()
});

/***** ROUTE START *****/
export const loginRoute = createRouteCallback(async ({ 
  req, 
  builder, 
  ctx: { 
    prisma 
  } 
}) => {
  const { username, password, id } = req.body;

  /***** VALIDATION *****/
  const validated = validator.safeParse({ username, password, id });
  if (!validated.success) {
    return builder({
      status: 400,
      data: validated.error.errors
    });
  }

  /***** DATABASE *****/
  const user = await prisma.user.findUnique({
    where: {
      username: validated.data.username
    }
  });

  const userExists = !!user;
  const validPassword = validatePassword(password, user?.hash ?? '', user?.salt ?? '');

  if (!userExists || !validPassword) {
    return builder({
      status: 401,
      data: 'Invalid credentials'
    });
  }

  /***** DONE OUR CHECKS, THE USER IS GOOD TO LOGIN *****/

  const createSessionResults = await createSession({ prisma, user, socketId: id });

  if ('error' in createSessionResults) {
    return builder(createSessionResults.error);
  } else {
    return builder(createSessionResults);
  }


  // //Create session ID
  // const expiry = {
  //   str: '14d',
  //   ms: 14 * 24 * 60 * 60 * 1000
  // }

  // const sessionToken = randomBytes(64).toString('base64');
  // const sessionJWT = await createJWT({ token: sessionToken }, expiry.str);

  // // Create Session
  // const session = await prisma.session.create({
  //   data: {
  //     userId: user.id,
  //     token: sessionToken,
  //     expires: new Date(Date.now() + expiry.ms)
  //   }
  // }).catch((error) => ({ error }));

  // const revertSession = async () => {
  //   await prisma.session.delete({
  //     where: {
  //       token: sessionToken
  //     }
  //   });
  // }

  // if ('error' in session) {
  //   return builder({
  //     status: 500,
  //     data: 'Could not create session. Please try again.'
  //   });
  // }

  // /**
  //  * Elevate the socket and attach the database ID to the socket for use later
  //  */
  // const elevationResult = elevateClient(id, user);

  // if (elevationResult.error) {
  //   await revertSession().catch(() => {});
  //   return builder({
  //     status: 401,
  //     data: 'Could not find socket identifier to elevate. Please try again.'
  //   });
  // }
  
  // /***** RETURN *****/
  // return builder({
  //   status: 200,
  //   data: {
  //     level: 'user',
  //     refreshToken: sessionJWT
  //   }
  // });
});

