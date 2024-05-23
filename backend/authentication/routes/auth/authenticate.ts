/***** BASE IMPORTS *****/
import { z } from "zod";

/***** MODELS *****/
import { createRouteCallback } from "../../models/base";

/***** UTILITIES *****/
import { validatePassword } from "shared/utilities/crypto";
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
  // note that both of these fields are unique and there is only one, so there will only be one user returned.
  const user = await prisma.user.findMany({
    where: {
      OR: [{
        username: validated.data.username,
      }, {
        email: validated.data.username
      }]
    },
  });

  const userExists = !!user && user.length > 0;
  const validPassword = validatePassword(password, user[0]?.hash ?? '', user[0]?.salt ?? '');

  if (!userExists || !validPassword) {
    return builder({
      status: 401,
      data: 'Invalid credentials'
    });
  }

  /***** DONE OUR CHECKS, THE USER IS GOOD TO LOGIN *****/
  const createSessionResults = await createSession({ prisma, user: user[0], socketId: id });

  if ('error' in createSessionResults) {
    return builder(createSessionResults.error);
  } else {
    return builder(createSessionResults);
  }
});

