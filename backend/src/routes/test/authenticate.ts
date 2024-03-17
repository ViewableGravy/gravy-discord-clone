import { createRouteCallback } from "../../models/base";
import { elevateClient } from "../../socket/store/helpers";


export const authenticateRoute = createRouteCallback(({ req, res, builder }) => {
  const { username, password, id } = req.body;

  // validate and get client information from DB
  if (username !== 'test' || password !== 'test') {
    return builder({
      status: 401,
      data: 'Invalid credentials'
    });
  }

  //hardcode user for now since DB not implemented
  const elevationResult = elevateClient(id, 'user');

  if (elevationResult.error) {
    return builder({
      status: 401,
      data: 'Could not elevate user with selected ID'
    });
  }
  
  return builder({
    status: 200,
    data: {
      level: 'user'
    }
  });
});

