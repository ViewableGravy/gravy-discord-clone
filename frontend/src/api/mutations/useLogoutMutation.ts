import { UseMutationOptions, useMutation, useMutationState } from "@tanstack/react-query";
import { API } from "../api";
import { _socketStore, useSocket } from "../../utilities/hooks/useSocket";
import { globalAxios } from "../axios";
import { useRefreshToken } from "../../utilities/hooks/useRefreshToken";
import { wait } from "../../utilities/functions/wait";

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
          _socketStore.subscribe(() => {
            if (_socketStore.state.authorization.level === 'guest') {
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
    },
    ...options
  }); 
}

export const useLogoutMutationState = () => useMutationState({ 
  filters: { 
    mutationKey: mutationKeys 
  },
  select: (state) => state.state.status
})
