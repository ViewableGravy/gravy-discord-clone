/***** BASE IMPORTS *****/
import { z } from "zod"
import { Prisma } from "@prisma/client"

/***** UTILITIES *****/
import { hashPassword } from "../../utilities/crypto"
import { createRouteCallback } from "../../models/base"

/***** CONSTS *****/
import { PRISMA_CODES } from "../../models/enums"

/***** VALIDATORS *****/
const bodyValidator = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  dob: z.object({
    day: z.union([z.number(), z.string()]),
    month: z.number({ coerce: true }).min(1).max(12).int(),
    year: z.number({ coerce: true }).min(1900).max(2024).int(),
  }),
})

/***** ROUTE START *****/
export const createAccount = createRouteCallback(async ({ builder, req, prisma }) => {
  const validated = bodyValidator.safeParse(req.body);
  
  if (!validated.success) {
    return builder({
      status: 400,
      data: validated.error.errors
    })
  }

  // specific validation responses
  const validateEmail = async () => {
    const { email } = validated.data;
    if (email.length > 100) {
      return 'email must be less than 100 characters'
    }
    if (await prisma.user.findUnique({ where: { email } })) {
      return 'email already exists'
    }
  }

  const validateUsername = async () => {
    const { username } = validated.data;
    if (username.length > 100) {
      return 'username must be less than 100 characters'
    }
    if (await prisma.user.findUnique({ where: { username } })) {
      return 'username already exists'
    }
  }

  const validatePassword = () => {
    const { password } = validated.data;
    if (password.length < 8) {
      return 'password must be at least 8 characters'
    }
    if (password.length > 100) {
      return 'password must be less than 100 characters'
    }
    if (!password.match(/[@$!%*?&]/)) {
      return 'password must contain at least one special character'
    }
    if (!password.match(/[A-Z]/)) {
      return 'password must contain at least one uppercase letter'
    }
    if (!password.match(/[a-z]/)) {
      return 'password must contain at least one lowercase letter'
    }
    if (!password.match(/[0-9]/)) {
      return 'password must contain at least one number'
    }
  }

  const validationErrors = {
    email: await validateEmail(),
    username: await validateUsername(),
    password: validatePassword(),
  }

  if (Object.values(validationErrors).some((error) => error)) {
    return builder({
      status: 400,
      data: {
        fieldErrors: validationErrors
      }
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