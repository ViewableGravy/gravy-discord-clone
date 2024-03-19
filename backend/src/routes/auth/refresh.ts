/***** BASE IMPORTS *****/
import { z } from "zod";

/***** MODELS *****/
import { createRouteCallback } from "../../models/base";

/***** UTILITIES *****/
import { elevateClient } from "../../socket/store/helpers";
import { createJWT, validatePassword, verifyJWT } from "../../utilities/crypto";
import { randomBytes } from "crypto";

/***** VALIDATION *****/
const validator = z.object({
  refreshToken: z.string(),
  id: z.string()
});

/***** ROUTE START *****/
export const refreshRoute = createRouteCallback(async ({ req, builder, prisma }) => {
  /***** VALIDATION *****/
  const validated = validator.safeParse(req.body);
  if (!validated.success) {
    return builder({
      status: 400,
      data: validated.error.errors
    });
  }

  const { id, refreshToken } = validated.data;

  /***** DATABASE *****/
  const verifiedToken = await verifyJWT(refreshToken, z.object({ token: z.string() })).catch((error) => ({ error }));

  if (!verifiedToken || 'error' in verifiedToken) {
    return builder({
      status: 401,
      data: 'Token could not be verified'
    });
  }

  const session = await prisma.session.findUnique({
    where: {
      token: verifiedToken.token
    },
    include: {
      user: true
    }
  }).catch((error) => ({ error }));

  if (!session || 'error' in session) {
    return builder({
      status: 401,
      data: 'No Active Session Found'
    });
  }

  /***** DONE OUR CHECKS, THE USER IS GOOD TO LOGIN *****/
  /**
   * Elevate the socket and attach the database ID to the socket for use later
   */
  const elevationResult = elevateClient(id, session.user);

  if (elevationResult.error) {
    return builder({
      status: 401,
      data: 'Could not find socket identifier to elevate. Please try again.'
    });
  }
  
  /***** RETURN *****/
  return builder({
    status: 200,
    data: {
      level: 'user'
    }
  });
});

