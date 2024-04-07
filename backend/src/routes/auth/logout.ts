/***** BASE IMPORTS *****/
import { z } from "zod";

/***** MODELS *****/
import { createRouteCallback } from "../../models/base";

/***** UTILITIES *****/
import { getSession } from "./helpers/getSession";
import { deElevateClient } from "../../socket/events/deElevateClient";
import { socketManager } from "../../socket/store";

/***** VALIDATION *****/
const validator = z.object({
  id: z.string(),
  refreshToken: z.string()
});

/***** CONSTS *****/
const responses = {
  InvalidSocket: {
    status: 401,
    data: 'Invalid session'
  },
  success: {
    status: 200,
    data: 'Logged out'
  }
} as const;

/***** ROUTE START *****/
export const logoutRoute = createRouteCallback(async ({ 
  req, 
  builder, 
  ctx: { 
    prisma 
  } 
}) => {
  /***** VALIDATION *****/
  const validated = validator.safeParse(req.body);
  if (!validated.success) {
    return builder({
      status: 400,
      data: validated.error.errors
    });
  }

  const { id } = validated.data;
  const client = socketManager.getClientById(id);
  const sessionResponse = await getSession({ ...validated.data }, { prisma });

  if ('error' in sessionResponse)
    return builder(sessionResponse);

  if (!client)
    return builder(responses.InvalidSocket);

  const { session } = sessionResponse;

  /***** DONE OUR CHECKS, THE USER IS GOOD TO LOGIN *****/
  await prisma.session.delete({
    where: {
      token: session.token
    }
  }),

  deElevateClient(client)

  return builder(responses.success);
});

