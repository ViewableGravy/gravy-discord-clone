/***** BASE IMPORTS *****/
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { globalAxios } from "../axios";

/***** UTILITIES *****/
import { _socketStore, useSocket } from "../../utilities/hooks/useSocket";
import { useRefreshToken } from "../../utilities/hooks/useRefreshToken";

/***** API IMPORTS *****/
import { API } from "../api";
import { TAuthenticationArgs } from "../apis/account";

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.POST.authenticate>>
type TOptions = UseMutationOptions<TReturnType, Error, Omit<TAuthenticationArgs, 'id'>, unknown> | undefined

/***** HOOK START *****/
export const useAuthenticateMutation = (options: TOptions = {}) => {
  /***** HOOKS *****/
  const { id } = useSocket(({ identifier: id }) => ({ id }));
  const [, setRefreshToken] = useRefreshToken();
  
  /***** RENDER *****/
  return useMutation({
    mutationFn: async (body) => {
      if (!id)
        throw new Error('No identifier found')

      return API.ACCOUNT.POST.authenticate({
        ...body,
        id
      })
    },
    onSuccess: async ({ data }) => {
      setRefreshToken(data.refreshToken);

      globalAxios.defaults.headers.common.Authorization = _socketStore.state.identifier;
    },
    ...options
  }); 
}
