import { z } from "zod"
import { createRouteCallback } from "../../models/base"
import type { NextFunction } from "express"
import { hashPassword } from "../../utilities/crypto"
import { Prisma } from "@prisma/client"
import { PRISMA_CODES } from "../../models/enums"

const bodyValidator = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
})

export const createAccount = createRouteCallback(async ({ builder, req, prisma }) => {
  const validated = bodyValidator.safeParse(req.body);
  
  if (!validated.success) {
    return builder({
      status: 400,
      data: validated.error.errors
    })
  }

  const { password, email, username } = validated.data;
  const { hash, salt }= hashPassword(password);

  const result = await prisma.user.create({
    data: {
      email,
      username,
      salt,
      hash,
    }
  }).catch((error) => ({ error }))

  if ('error' in result) {
    if (result.error instanceof Prisma.PrismaClientKnownRequestError) {
      if (result.error.code === PRISMA_CODES.UNIQUE_CONSTRAINT) {
        return builder({
          status: 400,
          code: PRISMA_CODES.UNIQUE_CONSTRAINT,
          data: 'email already exists'
        })
      }
    }

    return builder({
      status: 500,
      data: 'An unexpected error occurred. Please try again later.'
    })
  }

  return builder({
    status: 200,
    data: 'Account created'
  })
})