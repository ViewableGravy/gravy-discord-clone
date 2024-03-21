import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { API } from "../api";
import { _socketStore, useSocket } from "../../utilities/hooks/useSocket";
import { globalAxios } from "../axios";
import { useRefreshToken } from "../../utilities/hooks/useRefreshToken";

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.POST.logout>>
type TOptions = Omit<UseMutationOptions<TReturnType, Error, void, unknown>, 'mutationFn'> | undefined

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

      return API.ACCOUNT.POST.logout({ id, refreshToken })
    },
    onSuccess: async () => {
      globalAxios.defaults.headers.common.Authorization = undefined;
      setRefreshToken(undefined);

      _socketStore.setState((state) => ({
        ...state, 
        authorization: {
          level: 'guest'
        }
      }))
    },
    ...options
  }); 
}
