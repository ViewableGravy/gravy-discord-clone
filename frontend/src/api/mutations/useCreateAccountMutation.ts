/***** BASE IMPORTS *****/
import { UseMutationOptions, useMutation, useMutationState } from "@tanstack/react-query"
import { API } from "../api"
import { TCreateAccountArgs } from "../apis/account"

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.POST.create>>
type TOptions  = Omit<UseMutationOptions<TReturnType, Error, TCreateAccountArgs, unknown>, 'mutationFn'> | undefined

/***** HOOK START *****/
export const useCreateAccountMutation = (options: TOptions = {}) => {
  return useMutation({
    mutationFn: API.ACCOUNT.POST.create,
    mutationKey: ['application', 'unauthenticted', 'create'],
    ...options
  })
}

export const useCreateAccountMutationState = () => {
  return useMutationState({
    filters: { 
      mutationKey: ['application', 'unauthenticated', 'create'] 
    }
  })
}