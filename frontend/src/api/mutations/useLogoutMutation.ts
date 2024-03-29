/***** BASE IMPORTS *****/
import { UseMutationOptions, useMutation, useMutationState } from "@tanstack/react-query";
import { globalAxios } from "../axios";

/***** UTILITIES *****/
import { useSocket, authSocket } from "../../utilities/hooks/useSocket";
import { useRefreshToken } from "../../utilities/hooks/useRefreshToken";
import { wait } from "../../utilities/functions/wait";

/***** API IMPORTS *****/
import { API } from "../api";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.POST.logout>>
type TOptions = Omit<UseMutationOptions<TReturnType, Error, void, unknown>, 'mutationFn'> | undefined

/***** CONSTS *****/
const mutationKeys = ['logout'] as const;

/***** HOOK START *****/
export const useLogoutMutation = (options: TOptions = {}) => {
  /***** HOOKS *****/
  const { id } = useSocket(({ identifier: id }) => ({ id }));
  const [refreshToken, setRefreshToken] = useRefreshToken();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute()

  /***** RENDER *****/
  return useMutation({
    mutationFn: async () => {
      if (!refreshToken)
        throw new Error('No refresh token found')

      if (!id)
        throw new Error('No identifier found')

      const result = await API.ACCOUNT.POST.logout({ id, refreshToken })

      // wait for the socket to update the authorization level (or timeout after 5 seconds)
      return await Promise.race([
        new Promise<typeof result>((resolve) => {
          if (authSocket.store.state.authorization.level === 'guest') {
            resolve(result);
          }

          authSocket.store.subscribe(() => {
            if (authSocket.store.state.authorization.level === 'guest') {
              resolve(result);
            }
          })
        }),
        wait(5000, result)
      ]);
    },
    mutationKey: mutationKeys,
    onSuccess: async () => {
      globalAxios.defaults.headers.common.Authorization = undefined;
      setRefreshToken(undefined);
      if (!matchRoute({ to: '/login', pending: true })) {
        navigate({ to: '/login' })
      }
    },
    ...options
  }); 
}

/***** HOOK START *****/
export const useLogoutMutationState = () => useMutationState({ 
  filters: { 
    mutationKey: mutationKeys 
  },
  select: ({ state }) => ({ 
    status: state.status, 
    hasRunOnce: state.submittedAt !== undefined,
  })
})
