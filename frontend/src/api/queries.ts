import { useAuthenticateMutation } from "./mutations/useAuthenticateMutation";

export const API = {

  QUERIES: {

    

  },

  MUTATIONS: {

    /**
     * Mutation for logging in a user. This will automatically update the socket store with the new authorization level.
     */
    useAuthenticateMutation

  }

} as const;