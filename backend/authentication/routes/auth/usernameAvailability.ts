/***** BASE IMPORTS *****/
import { z } from "zod";

/***** MODELS *****/
import { createRouteCallback } from "../../models/base";

/***** VALIDATION *****/
const validator = z.object({
  username: z.string()
});

/***** ROUTE START *****/
export const usernameAvailabilityRoute = createRouteCallback(async ({ 
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

  const { username } = validated.data;

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  const pendingUser = await prisma.pendingUser.findUnique({
    where: {
      username
    }
  });

  return builder({
    status: 200,
    data: {
      exists: !!user || !!pendingUser
    }
  });
});
