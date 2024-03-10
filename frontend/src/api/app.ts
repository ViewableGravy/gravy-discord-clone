import { _socketStore } from "../utilities/hooks/useSocket";
import { z } from "zod";
import { globalAxios } from "./axios";

export type TAuthenticationArgs = {
  username: string,
  password: string
}

export const APP_API_VALIDATORS = {
  authenticate: z.object({ 
    level: z.union([
      z.null(), 
      z.literal('user'), 
      z.literal('admin')
    ]) 
  })
} as const;

export const APP_API = {

  POST: {

    /**
     * Authenticates a user and returns the level of authorization
     * 
     * Note: The useMutation associated with this endpoint handles updating the socket store.
    */
   authenticate: async (args: TAuthenticationArgs) => {
     const result = await globalAxios.post('/authenticate', args);
     return APP_API_VALIDATORS.authenticate.parse(result.data);
    }
    
  }

} as const;