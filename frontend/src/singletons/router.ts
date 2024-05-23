/***** BASE IMPORTS *****/
import { createRouter } from "@tanstack/react-router"
import { routeTree } from "../routeTree.gen"

/***** EXPORTS *****/
export const router = createRouter({ 
  routeTree
})

/***** TYPE DEFINITIONS *****/
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}