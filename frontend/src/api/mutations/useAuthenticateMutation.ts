/***** BASE IMPORTS *****/
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { _socketStore, useSocket } from "../../utilities/hooks/useSocket";
import { API } from "../api";
import { TAuthenticationArgs } from "../apis/account";
import { globalAxios } from "../axios";

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.POST.authenticate>>
type TOptions = UseMutationOptions<TReturnType, Error, Omit<TAuthenticationArgs, 'id'>, unknown> | undefined

/***** HOOK START *****/
export const useAuthenticateMutation = (options: TOptions = {}) => {
  /***** HOOKS *****/
  const { id } = useSocket(({ identifier: id }) => ({ id }));
  
  /***** RENDER *****/
  return useMutation({
    mutationFn: (body) => API.ACCOUNT.POST.authenticate({
      ...body,
      id
    }),
    onSuccess: async ({ data }) => {
      _socketStore.setState((state) => { 
        globalAxios.defaults.headers.common.Authorization = state.identifier;
        
        return {
          ...state, 
          authorization: {
            ...data
          }
        }
      })
    },
    ...options
  }); 
}
