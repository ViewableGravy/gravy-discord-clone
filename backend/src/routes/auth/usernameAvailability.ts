/***** BASE IMPORTS *****/
import { z } from "zod";

/***** MODELS *****/
import { createRouteCallback } from "../../models/base";

/***** UTILITIES *****/
import { elevateClient } from "../../socket/events/elevateClient";
import { getSession } from "./helpers/getSession";

/***** VALIDATION *****/
const validator = z.object({
  username: z.string()
});

/***** ROUTE START *****/
export const usernameAvailabilityRoute = createRouteCallback(async ({ req, builder, prisma }) => {
  /***** VALIDATION *****/
  const validated = validator.safeParse(req.body);
  if (!validated.success) {
    return builder({
      status: 400,
      data: validated.error.errors
    });
  }

  const { username } = validated.data;

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  return builder({
    status: 200,
    data: {
      exists: !!user
    }
  });
});