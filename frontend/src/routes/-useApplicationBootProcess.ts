/***** BASE IMPORTS *****/
import { useEffect } from "react";

/***** QUERY IMPORTS *****/
import { API } from "../api/queries";

/***** HOOKS *****/
import { useRefreshToken } from "../utilities/hooks/useRefreshToken";
import { useSocket } from "../utilities/hooks/useSocket";

/***** COMPONENT START *****/
export const useApplicationBootProcess = () => {
  /***** HOOKS *****/
  const [refreshToken] = useRefreshToken();
  const { readyState, authorization } = useSocket(({ readyState, authorization }) => ({ readyState, authorization }))

  /***** QUERIES *****/
  const { mutate: refresh, status: refreshStatus } = API.MUTATIONS.account.useRefreshTokenMutation();
  const [status] = API.MUTATIONS.account.useLogoutMutationState()

  /***** EFFECTS *****/
  useEffect(() => {
    // make api request when application is ready and a refresh token is present
    if (refreshToken && authorization.level === 'guest' && status !== 'pending') {
      refresh();
    }
  }, [refreshToken, authorization.level, readyState === 'READY'])

  return {
    applicationLoading: readyState !== 'READY' || refreshStatus === 'pending'
  }
}