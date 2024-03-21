import { _socketStore } from "../../utilities/hooks/useSocket";
import { z } from "zod";
import { globalAxios } from "../axios";

export type TAuthenticationArgs = {
  username: string,
  password: string,
  id: string,
}

export type TCreateAccountArgs = {
  username: string,
  password: string,
  email: string
}

export type TRefreshArgs = {
  refreshToken: string,
  id: string
}

export type TLogoutArgs = {
  refreshToken: string,
  id: string
}

export const ACCOUNT_API_VALIDATORS = {
  authenticate: z.object({ 
    data: z.object({
      level: z.union([
        z.null(), 
        z.literal('guest'),
        z.literal('user'), 
        z.literal('admin')
      ]),
      refreshToken: z.string(),
    })
  }),
  create: z.object({
    status: z.literal(200),
    data: z.string()
  }),
  refresh: z.object({
    data: z.object({
      level: z.union([
        z.null(), 
        z.literal('guest'),
        z.literal('user'), 
        z.literal('admin')
      ])
    })
  })
} as const;

export const ACCOUNT_API = {

  POST: {

    /**
     * Authenticates a user and returns the level of authorization
     * 
     * Note: The useMutation associated with this endpoint handles updating the socket store.
    */
    authenticate: async (body: TAuthenticationArgs) => {
      const result = await globalAxios.post('/auth/login', body);
      return ACCOUNT_API_VALIDATORS.authenticate.parse(result.data);
    },

    /**
     * Logs in the user using the refresh token stored in local storage
     */
    refresh: async (body: TRefreshArgs) => {
      const result = await globalAxios.post('/auth/refresh', body);
      return ACCOUNT_API_VALIDATORS.refresh.parse(result.data);
    },

    /**
     * Creates a new account
     */
    create: async (body: TCreateAccountArgs) => {
      const result = await globalAxios.post('/auth/signup', body);
      return ACCOUNT_API_VALIDATORS.create.parse(result.data);
    },

    /**
     * Logs out the user for the current session
     */
    logout: async (body: TLogoutArgs) => {
      const result = await globalAxios.post('/auth/logout', body);
      return result.data;
    }
  },

  GET: {

    /**
     * Example endpoint that can be invalidated
     */
    example: () => {
      return new Promise((resolve) => {
        globalAxios.get('/test/example').then((response) => {
          setTimeout(() => {
            resolve(response);
          }, 1000);
        }).catch((error) => ({ error }))
      })
    }

  }

} as const;
