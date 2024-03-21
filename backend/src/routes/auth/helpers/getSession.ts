import { verifyJWT } from "../../../utilities/crypto";
import type { TBuilder, TPrisma } from "../../../models/base";
import { z } from "zod";
import type { Session, User } from "@prisma/client";

/***** CONSTS *****/
const responses = {
  invalidToken: {
    status: 401,
    data: 'Token could not be verified',
    error: true
  },
  noActiveSession: {
    status: 401,
    data: 'No Active Session Found',
    error: true
  },
  noUserFound: {
    status: 401,
    data: 'No user found for session',
    error: true
  }
} satisfies Record<string, Parameters<TBuilder>[0] & { error: true }>;

export const getSession = async ({ refreshToken }: { refreshToken: string }, { prisma }: { prisma: TPrisma }) => {
  /***** TYPE DEFINITIONS *****/
  type TSuccessResponse = {
    session: Session & { user: User }
    verifiedToken: typeof verifiedToken
  }

  /***** RENDER *****/
  const verifiedToken = await verifyJWT(refreshToken, z.object({ token: z.string() })).catch((error) => ({ error }));

  // If we have an error, then the token is invalid
  if (!verifiedToken || 'error' in verifiedToken) {
    return responses.invalidToken;
  }

  const session = await prisma.session.findUnique({
    where: {
      token: verifiedToken.token
    },
    include: {
      user: true
    }
  }).catch((error) => ({ error }));

  // If we have no session, then the token is invalid
  if (!session || 'error' in session) {
    return responses.noActiveSession;
  }

  // If we have a session, but no user, then something is wrong
  if (!session.user) {
    return responses.noActiveSession;
  }

  // Success
  return { session, verifiedToken } as TSuccessResponse;
}