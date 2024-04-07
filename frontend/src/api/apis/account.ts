/***** BASE IMPORTS *****/
import { z } from "zod";
import { globalAxios } from "../axios";

/***** UTILITIES *****/
import { waitAtleast } from "../../utilities/functions/wait";

/***** TYPE DEFINITIONS *****/
export type TAuthenticationArgs = {
  username: string,
  password: string,
  id: string,
}

export type TCreateAccountArgs = {
  username: string,
  password: string,
  displayName: string,
  email: string,
  dob: {
    day: string,
    month: string,
    year: string
  },
  notifications: boolean,
}

export type TRefreshArgs = {
  refreshToken: string,
  id: string
}

export type TLogoutArgs = {
  refreshToken: string,
  id: string
}

export type TUsernameAvailabilityArgs = {
  username: string
}

export type TVerifyArgs = {
  token: string;
  username: string;
  id: string;
}

const successObject = z.object({
  status: z.literal(200),
  route: z.string(),
  data: z.unknown()
})

/***** VALIDATORS *****/
export const ACCOUNT_API_VALIDATORS = {
  authenticate: z.intersection(successObject, z.object({ 
    data: z.object({
      level: z.union([
        z.null(), 
        z.literal('guest'),
        z.literal('user'), 
        z.literal('admin')
      ]),
      refreshToken: z.string(),
    })
  })),
  create: z.intersection(successObject, z.object({
    data: z.object({
      message: z.string()
    })
  })),
  refresh: z.intersection(successObject, z.object({
    data: z.object({
      level: z.union([
        z.null(), 
        z.literal('guest'),
        z.literal('user'), 
        z.literal('admin')
      ])
    })
  })),
  usernameAvailability: z.intersection(successObject, z.object({
    data: z.object({
      exists: z.boolean()
    })
  })),
  verify: z.intersection(successObject, z.object({
    data: z.object({
      level: z.union([
        z.null(), 
        z.literal('guest'),
        z.literal('user'), 
        z.literal('admin')
      ]),
      refreshToken: z.string(),
    })
  }))
} as const;

/***** API START *****/
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
      // const result = globalAxios.post('/auth/refresh', body);
      const result = await waitAtleast(500, globalAxios.post('/auth/refresh', body))
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
     * Checks if a username is available
     */
    usernameAvailability: async (body: TUsernameAvailabilityArgs) => {
      const result = await globalAxios.post('/auth/username-availability', body);
      return ACCOUNT_API_VALIDATORS.usernameAvailability.parse(result.data);
    },

    /**
     * Logs out the user for the current session
     */
    logout: async (body: TLogoutArgs) => {
      const result = await globalAxios.post('/auth/logout', body);
      return result.data;
    },

    /**
     * Verifies a user has access to their email and finalizes the account creation process.
     * This endpoint also logs the user in and returns a refresh token with an identical
     * response to the authenticate endpoint.
     */
    verify: async (body: TVerifyArgs) => {
      const result = await waitAtleast(1000, globalAxios.post('/auth/verify', body));
      return ACCOUNT_API_VALIDATORS.verify.parse(result.data);
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
