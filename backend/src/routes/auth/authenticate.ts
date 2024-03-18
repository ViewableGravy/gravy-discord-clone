/***** BASE IMPORTS *****/
import { z } from "zod";

/***** MODELS *****/
import { createRouteCallback } from "../../models/base";

/***** UTILITIES *****/
import { elevateClient } from "../../socket/store/helpers";
import { validatePassword } from "../../utilities/crypto";

/***** VALIDATION *****/
const validator = z.object({
  username: z.string(),
  password: z.string(),
  id: z.string().nullable()
});

/***** ROUTE START *****/
export const authenticateRoute = createRouteCallback(async ({ req, builder, prisma }) => {
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

  if (!user || !validatePassword(password, user.hash, user.salt)) {
    return builder({
      status: 401,
      data: 'Invalid credentials'
    });
  }

  /***** DONE OUR CHECKS, THE USER IS GOOD TO LOGIN *****/

  /**
   * Elevate the socket and attach the database ID to the socket for use later
   */
  const elevationResult = elevateClient(id, user);

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

