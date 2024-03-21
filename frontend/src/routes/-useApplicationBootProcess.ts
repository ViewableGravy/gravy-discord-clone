/***** QUERY IMPORTS *****/
import { useEffect } from "react";
import { useRefreshToken } from "../utilities/hooks/useRefreshToken";
import { API } from "../api/queries";
import { useSocket } from "../utilities/hooks/useSocket";

/***** COMPONENT START *****/
export const useApplicationBootProcess = () => {
  /***** HOOKS *****/
  const [refreshToken] = useRefreshToken();
  const { readyState, authorization } = useSocket(({ readyState, authorization }) => ({ readyState, authorization }))

  /***** QUERIES *****/
  const { mutate: refresh } = API.MUTATIONS.account.useRefreshTokenMutation();

  /***** EFFECTS *****/
  useEffect(() => {
    // make api request when application is ready and a refresh token is present
    if (refreshToken && authorization.level === 'guest') {
      refresh();
    }
  }, [refreshToken, authorization.level, readyState === 'READY'])

}