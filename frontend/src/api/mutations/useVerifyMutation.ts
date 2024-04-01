/***** BASE IMPORTS *****/
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { globalAxios } from "../axios";
import { useNavigate } from "@tanstack/react-router";

/***** UTILITIES *****/
import { useSocket, authSocket } from "../../utilities/hooks/useSocket";
import { useRefreshToken } from "../../utilities/hooks/useRefreshToken";

/***** API IMPORTS *****/
import { API } from "../api";
import { TVerifyArgs } from "../apis/account";

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.POST.verify>>
type TOptions = UseMutationOptions<TReturnType, Error, Omit<TVerifyArgs, 'id'>, unknown> | undefined

export const useVerifyMutation = (options: TOptions = {}) => {
  /***** HOOKS *****/
  const { id, ready } = useSocket(({ identifier: id, readyState }) => ({ id, ready: readyState === "READY" }));
  const [, setRefreshToken] = useRefreshToken();
  const navigate = useNavigate();

  /***** RENDER *****/
  return useMutation({
    mutationFn: async (body) => {
      if (!id)
        throw new Error('No identifier found');

      if (!ready)
        throw new Error('Socket not ready, please wait and try again.');

      return API.ACCOUNT.POST.verify({
        ...body,
        id
      })
    },
    onSuccess: async ({ data }) => {
      setRefreshToken(data.refreshToken);

      globalAxios.defaults.headers.common.Authorization = authSocket.store.state.identifier;

      navigate({ to: '/dashboard', from: "/verify" })
    },
    ...options
  })
}