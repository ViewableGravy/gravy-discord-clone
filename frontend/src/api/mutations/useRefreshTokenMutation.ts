import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { API } from "../api";
import { _socketStore, useSocket } from "../../utilities/hooks/useSocket";
import { globalAxios } from "../axios";
import { useLocalStorage } from "../../utilities/hooks/useLocalStorage";

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.POST.authenticate>>
type TOptions = Omit<UseMutationOptions<TReturnType, Error, void, unknown>, 'mutationFn'> | undefined

/***** HOOK START *****/
export const useRefreshTokenMutation = (options: TOptions = {}) => {
  /***** HOOKS *****/
  const { id } = useSocket(({ identifier: id }) => ({ id }));
  const [refreshToken] = useLocalStorage<undefined | string>('refreshToken', undefined, { deserializer: (value) => value });

  /***** RENDER *****/
  return useMutation({
    mutationFn: async () => {
      if (!refreshToken)
        throw new Error('No refresh token found')

      if (!id)
        throw new Error('No identifier found')

      return API.ACCOUNT.POST.refresh({ id, refreshToken })
    },
    onSuccess: async ({ data }) => {
      _socketStore.setState((state) => { 
        globalAxios.defaults.headers.common.Authorization = state.identifier;
        
        return {
          ...state, 
          authorization: {
            level: data.level
          }
        }
      })
    },
    ...options
  }); 
}
