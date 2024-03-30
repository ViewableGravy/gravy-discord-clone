/***** QUERY IMPORTS *****/
import { useAuthenticateMutation } from "./mutations/useAuthenticateMutation";
import { useCreateAccountMutation, useCreateAccountMutationState } from "./mutations/useCreateAccountMutation";
import { useLogoutMutation, useLogoutMutationState } from "./mutations/useLogoutMutation";
import { useRefreshTokenMutation } from "./mutations/useRefreshTokenMutation";
import { useExampleQuery } from "./queries/useExampleQuery";

/***** API START *****/
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
      useCreateAccountMutationState,

      /**
       * Mutation for refreshing the user's token.
       */
      useRefreshTokenMutation,

      /**
       * Mutation for logging out the user.
       */
      useLogoutMutation,
      useLogoutMutationState
    }

  }

} as const;