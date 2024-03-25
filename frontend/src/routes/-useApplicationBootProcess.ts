/***** QUERY IMPORTS *****/
import { API } from "../api/queries";

/***** HOOKS *****/
import { useRefreshToken } from "../utilities/hooks/useRefreshToken";
import { useSocket } from "../utilities/hooks/useSocket";
import { useFirstEffect } from "../utilities/hooks/useFirstEffect";

/***** COMPONENT START *****/
export const useApplicationBootProcess = () => {
  /***** HOOKS *****/
  const [refreshToken] = useRefreshToken();
  const { readyState, authorization } = useSocket(({ readyState, authorization }) => ({ readyState, authorization }))

  /***** QUERIES *****/
  const { mutate: refresh, status: refreshStatus } = API.MUTATIONS.account.useRefreshTokenMutation();
  const [logoutState] = API.MUTATIONS.account.useLogoutMutationState()
  const { hasRunOnce: hasLoggedOutOnce } = logoutState ?? {}

  /***** EFFECTS *****/
  useFirstEffect(() => {
    refresh()
  }, !!refreshToken && authorization.level === 'guest' && !hasLoggedOutOnce)

  /***** RENDER *****/
  return {
    applicationLoading: readyState !== 'READY' || refreshStatus === 'pending' && !hasLoggedOutOnce,
  }
}