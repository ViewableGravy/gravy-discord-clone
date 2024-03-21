/***** BASE IMPORTS *****/
import { z } from "zod";

/***** MODELS *****/
import { createRouteCallback } from "../../models/base";

/***** UTILITIES *****/
import { elevateClient } from "../../socket/events/elevateClient";
import { getSession } from "./helpers/getSession";

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

  /***** DATABASE *****/
  const sessionResponse = await getSession({ ...validated.data }, { prisma });

  if ('error' in sessionResponse) {
    return builder(sessionResponse);
  }

  const { session } = sessionResponse;

  /***** DONE OUR CHECKS, THE USER IS GOOD TO LOGIN *****/
  /**
   * Elevate the socket and attach the database ID to the socket for use later
   */
  const elevationResult = elevateClient(validated.data.id, session.user);

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

