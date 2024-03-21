import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { API } from "../api";
import { _socketStore, useSocket } from "../../utilities/hooks/useSocket";
import { globalAxios } from "../axios";
import { useRefreshToken } from "../../utilities/hooks/useRefreshToken";
import { AxiosError } from "axios";

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.POST.refresh>>
type TOptions = Omit<UseMutationOptions<TReturnType, Error, void, unknown>, 'mutationFn'> | undefined

/***** HOOK START *****/
export const useRefreshTokenMutation = (options: TOptions = {}) => {
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

      return await API.ACCOUNT.POST.refresh({ id, refreshToken })
    },
    onSuccess: async () => {
      globalAxios.defaults.headers.common.Authorization = _socketStore.state.identifier;
    },
    onError: async (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          console.warn('Attempted to refresh with invalid token');
          setRefreshToken(undefined);
        }
      }
    },
    ...options
  }); 
}
