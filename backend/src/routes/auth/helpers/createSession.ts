import { randomBytes } from "crypto";
import type { prisma, TStandardBuilder } from "../../../models/base";
import type { User } from "@prisma/client";
import { createJWT } from "../../../utilities/crypto";
import { elevateClient } from "../../../socket/events/elevateClient";

type TArgs = {
  prisma: typeof prisma,
  user: User,
  socketId: string
}

type TCreateSession = (args: TArgs) => Promise<{ error: TStandardBuilder; } | TStandardBuilder>;

export const createSession: TCreateSession = async ({ prisma, user, socketId }) => {
  //Create session ID
  const expiry = {
    str: '14d',
    ms: 14 * 24 * 60 * 60 * 1000
  }

  const sessionToken = randomBytes(64).toString('base64');
  const sessionJWT = await createJWT({ token: sessionToken }, expiry.str);

  // Create Session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expires: new Date(Date.now() + expiry.ms)
    }
  }).catch((error) => ({ error }));

  const revertSession = async () => {
    await prisma.session.delete({
      where: {
        token: sessionToken
      }
    });
  }

  if ('error' in session) {
    return {
      error: {
        status: 500,
        data: 'Could not create session. Please try again.'
      }
    };
  }

  /**
   * Elevate the socket and attach the database ID to the socket for use later
   */
  const elevationResult = elevateClient(socketId, user);

  if (elevationResult.error) {
    await revertSession().catch(() => {});
    return {
      error: {
        status: 401,
        data: 'Could not find socket identifier to elevate. Please try again.'
      }
    };
  }

  return {
    status: 200,
    data: {
      level: 'user',
      refreshToken: sessionJWT
    }
  }
}