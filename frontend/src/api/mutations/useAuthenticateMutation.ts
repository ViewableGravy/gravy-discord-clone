import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { _socketStore } from "../../utilities/hooks/useSocket";
import { API } from "../api";
import { TAuthenticationArgs } from "../apis/app";
import { globalAxios } from "../axios";


type TReturnType = Awaited<ReturnType<typeof API.APP.POST.authenticate>>
type TOptions = UseMutationOptions<TReturnType, Error, TAuthenticationArgs, unknown>

export const useAuthenticateMutation = (options: TOptions) => useMutation({
  mutationFn: API.APP.POST.authenticate,
  mutationKey: ['socket', 'authenticate'],
  onSuccess: async (data) => {
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
