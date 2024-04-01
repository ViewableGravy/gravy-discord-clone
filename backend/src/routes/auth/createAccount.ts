/***** BASE IMPORTS *****/
import { z } from "zod"
import { Prisma } from "@prisma/client"

/***** UTILITIES *****/
import { createJWT, generateRandomToken, hashPassword, validatePassword } from "../../utilities/crypto"
import { createRouteCallback } from "../../models/base"

/***** CONSTS *****/
import { DEBUG_LEVELS, PRISMA_CODES } from "../../models/enums"
import { log } from "console"

const monthsToNumber = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
}

/***** VALIDATORS *****/
const bodyValidator = z.object({
  username: z.string()
    .min(3, { message: "Username must be atleast 3 characters" })
    .max(100, { message: "Username cannot be longer than 100 characters" })
    .toLowerCase(),
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
  displayName: z.string().optional(),
  notifications: z.boolean().optional(),
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
export const createAccount = createRouteCallback(async ({ 
  builder, 
  req, 
  ctx: { 
    prisma,
    mailer 
  } 
}) => {
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

  const { password, email, username, dob, displayName, notifications } = validated.data;
  const verificationToken = generateRandomToken().replace(/=$/, '');

  const { hash, salt } = hashPassword(password);
  const { hash: verificationHash, salt: verificationSalt } = hashPassword(verificationToken); // remove trailing "=" due to frontend @tanstack/router bug (https://github.com/TanStack/router/issues/1404)

  // send verification email
  const sendMail = async (revert: () => Promise<void>) => { 
    const mailResult = await mailer.sendMail({
      subject: 'Verify your email',
      to: email,
      html: mailer.templates.email.verificationEmail({ 
        displayName: displayName ?? username,
        email,
        username,
        verificationToken
      })
    }).catch((error) => ({ error }))

    if ('error' in mailResult) {
      log(DEBUG_LEVELS.ERROR, mailResult.error)

      await revert()

      throw {
        status: 500,
        data: 'An unexpected error occurred sending a verification email. Please try again later.'
      }
    }
  }

  //check if a pending request already exists
  const existingPendingUser = await prisma.pendingUser.findUnique({ where: { email } })

  if (existingPendingUser) {
    await prisma.pendingUser.update({
      where: {
        id: existingPendingUser.id
      },
      data: {
        signupHash: verificationHash,
        signupSalt: verificationSalt
      }
    })

    sendMail(async () => {
      await prisma.pendingUser.update({
        where: {
          id: existingPendingUser.id
        },
        data: {
          signupHash: existingPendingUser.signupHash,
          signupSalt: existingPendingUser.signupSalt
        }
      })
    });
  } else {
    const result = await prisma.pendingUser.create({
      data: {
        email,
        username,
        displayName: displayName ?? username,
        notifications: notifications ?? false,
        createdAt: new Date(),
        dob: new Date(`${dob.year}-${monthsToNumber[dob.month]}-${dob.day}`),
        salt,
        hash,
        signupSalt: verificationSalt,
        signupHash: verificationHash,
      }
    })

    sendMail(async () => {
      await prisma.pendingUser.delete({ where: { id: result.id } })
    });
  }

  return builder({
    status: 200,
    data: {
      message: "An email has been sent to verify your account. Please check your inbox." 
    }
  })
})