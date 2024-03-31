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
  username: z.string()
    .min(3, { message: "Username must be atleast 3 characters" })
    .max(100, { message: "Username cannot be longer than 100 characters" }),
  password: z.string()
    .min(8, { message: "Password must be atleast 8 characters" })
    .max(100, { message: "Password cannot be longer than 100 characters" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  email: z.string()
    .email({ message: "Invalid email" })
    .max(100, { message: "Email cannot be longer than 100 characters" }),
  dob: z.object({
    day: z.number({ coerce: true })
      .min(1, { message: "The provided day must be greater than 1"})
      .max(31, { message: "The provided day must be less than 31" }),
    month: z.union([
      z.literal('January'),
      z.literal('February'),
      z.literal('March'),
      z.literal('April'),
      z.literal('May'),
      z.literal('June'),
      z.literal('July'),
      z.literal('August'),
      z.literal('September'),
      z.literal('October'),
      z.literal('November'),
      z.literal('December'),
    ]),
    year: z.number({ coerce: true })
      .min(1900, { message: "The provided year must be greater than 1900"})
      .max(new Date().getUTCFullYear(), { message: "The provided year must be less than 2024"})
  }),
})

/***** ROUTE START *****/
export const createAccount = createRouteCallback(async ({ builder, req, prisma }) => {
  const validated = bodyValidator.safeParse(req.body);
  
  if (!validated.success) {
    return builder({
      type: "fieldError",
      status: 400,
      fieldErrors: {
        email: validated.error.errors.find((error) => error.path[0] === 'email')?.message,
        username: validated.error.errors.find((error) => error.path[0] === 'username')?.message,
        password: validated.error.errors.find((error) => error.path[0] === 'password')?.message,
        dob: validated.error.errors.find((error) => error.path[0] === 'dob')?.message,
      }
    })
  }

  // specific validation responses
  const validateEmail = async () => {
    if (await prisma.user.findUnique({ where: { email: validated.data.email } })) {
      return 'email already exists'
    }
  }

  const validateUsername = async () => {
    if (await prisma.user.findUnique({ where: { username: validated.data.username } })) {
      return 'username already exists'
    }
  }

  const fieldErrors = {
    email: await validateEmail(),
    username: await validateUsername(),
  }

  if (Object.values(fieldErrors).some((error) => error)) {
    return builder({
      type: "fieldError",
      status: 400,
      fieldErrors
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