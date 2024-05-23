/***** BASE IMPORTS *****/
import { QueryClient } from "@tanstack/react-query";

/***** EXPORTS *****/
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 3,
    }
  }
})