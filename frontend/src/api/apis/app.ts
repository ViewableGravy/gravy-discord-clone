import { _socketStore } from "../../utilities/hooks/useSocket";
import { z } from "zod";
import { globalAxios } from "../axios";

export type TAuthenticationArgs = {
  username: string,
  password: string,
  id: string | null,
}

export const APP_API_VALIDATORS = {
  authenticate: z.object({ 
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

export const APP_API = {

  POST: {

    /**
     * Authenticates a user and returns the level of authorization
     * 
     * Note: The useMutation associated with this endpoint handles updating the socket store.
    */
    authenticate: async (body: TAuthenticationArgs) => {
      const result = await globalAxios.post('/test/authenticate', body);
      return APP_API_VALIDATORS.authenticate.parse(result.data);
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