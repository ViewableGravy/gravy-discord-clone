import { z } from "zod"
import { createRouteCallback } from "../../models/base"
import type { NextFunction } from "express"

const bodyValidator = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
})

export const createAccount = createRouteCallback(({ builder, req }) => {
  

  return builder({
    status: 200,
    data: 'yes'
  })
})