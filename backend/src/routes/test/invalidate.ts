import { createRouteCallback } from "../../models/base"
import { INVALIDATE_ROOMS } from "../../models/enums"
import { invalidateRooms } from "../../socket/store/helpers"

export const testInvalidateRoute = createRouteCallback(({ builder, req }) => {
  const endpoint = req.query.endpoint as ValueOf<typeof INVALIDATE_ROOMS>

  if (!Object.values(INVALIDATE_ROOMS).includes(endpoint)) {
    return builder({
      status: 400,
      data: "Could not match an endpoint to invalidate"
    })
  }

  invalidateRooms([endpoint])

  return builder({
    status: 200,
    data: `invalidated 'invalidate/${endpoint}'`,
  })
})