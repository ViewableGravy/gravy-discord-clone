import { createAuthenticatedRouteCallback } from "../../models/base";

export const authenticatedRoute = createAuthenticatedRouteCallback('guest', ({ builder }) => {
  builder({ status: 200, data: 'You are authorized' });
})