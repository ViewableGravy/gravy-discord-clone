import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { _socketStore, useSocket } from "../../utilities/hooks/useSocket";
import { API } from "../api";
import { TAuthenticationArgs } from "../apis/app";
import { globalAxios } from "../axios";


type TReturnType = Awaited<ReturnType<typeof API.APP.POST.authenticate>>
type TOptions = UseMutationOptions<TReturnType, Error, Omit<TAuthenticationArgs, 'id'>, unknown> | undefined

export const useAuthenticateMutation = (options: TOptions = {}) => {
  const { id } = useSocket(({ identifier: id }) => ({ id }));
  
  return useMutation({
    mutationFn: (body) => API.APP.POST.authenticate({
      ...body,
      id
    }),
    mutationKey: ['socket', 'authenticate'],
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
