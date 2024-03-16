import { createRouteCallback } from "../../models/base"

export const createAccount = createRouteCallback(({ builder, req }) => {
 

  return builder({
    status: 200,
    data: 'yes'
  })
})