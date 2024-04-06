/***** BASE IMPORTS *****/
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { globalAxios } from "../axios";
import { useNavigate } from "@tanstack/react-router";

/***** UTILITIES *****/
import { useAuthorizationSocket, authSocket } from "../../utilities/hooks/useSocket";
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
  const { id } = useAuthorizationSocket(({ identifier: id }) => ({ id }));
  const [, setRefreshToken] = useRefreshToken();
  const navigate = useNavigate();
  
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
    mutationKey: ['authenticate'],
    onSuccess: async ({ data }) => {
      setRefreshToken(data.refreshToken);

      globalAxios.defaults.headers.common.Authorization = authSocket.store.state.identifier;

      navigate({ to: '/dashboard' })
    },
    ...options
  }); 
}
