import { createRouter } from "@tanstack/react-router";
import { _rootRoute } from "./routes";
import { dashboardRoute } from "./routes/dashboard";

const routeTree = _rootRoute.addChildren([
  dashboardRoute
])

export const rootRoute = _rootRoute;
export const router = createRouter({
  basepath: "/",
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}