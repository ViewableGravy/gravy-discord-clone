import { useAuthenticateMutation } from "./mutations/useAuthenticateMutation";
import { useCreateAccountMutation } from "./mutations/useCreateAccountMutation";
import { useRefreshTokenMutation } from "./mutations/useRefreshTokenMutation";
import { useExampleQuery } from "./queries/useExampleQuery";

export const API = {

  QUERIES: {

    /**
     * Example query for fetching data from the server.
     */
    useExampleQuery

  },

  MUTATIONS: {

    account: {
      /**
       * Mutation for logging in a user. This will automatically update the socket store with the new authorization level.
       */
      useAuthenticateMutation,

      /**
       * Mutation for creating a new account.
       */
      useCreateAccountMutation,

      /**
       * Mutation for refreshing the user's token.
       */
      useRefreshTokenMutation
    }

  }

} as const;