import { z } from "zod";
import { createRouteCallback } from "../../models/base";
import { validatePassword } from "../../utilities/crypto";
import { createSession } from "./helpers/createSession";

const bodyValidator = z.object({
  token: z.string(),
  username: z.string(),
  id: z.string()
})

export const verifyAccount = createRouteCallback(async ({ 
  builder, 
  req, 
  ctx: { 
    prisma
  } 
}) => {

  const validated = bodyValidator.safeParse(req.body);

  if (!validated.success) {
    return builder({
      status: 400,
      data: validated.error.errors
    });
  }

  const { token, username, id } = validated.data;

  const pendingUser = await prisma.pendingUser.findUnique({
    where: { 
      username 
    }
  }).catch((error) => { error });

  if (!pendingUser) {
    return builder({
      status: 401,
      data: 'Invalid token'
    });
  }

  const isValidToken = validatePassword(token, pendingUser.signupHash, pendingUser.signupSalt);

  if (!isValidToken) {
    return builder({
      status: 401,
      data: 'Invalid token'
    });
  }

  const result = await prisma.$transaction([
    prisma.user.create({
      data: {
        username,
        hash: pendingUser.hash,
        salt: pendingUser.salt,
        email: pendingUser.email,
        dob: pendingUser.dob,
        displayName: pendingUser.displayName,
        notifications: pendingUser.notifications,
      }
    }),
    prisma.pendingUser.delete({
      where: {
        username
      }
    })
  ]);

  const createSessionResult = await createSession({ prisma, user: result[0], socketId: id });

  if ('error' in createSessionResult) {
    return builder(createSessionResult.error);
  } else {
    return builder(createSessionResult);
  }

})
