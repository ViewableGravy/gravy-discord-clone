/***** BASE IMPORTS *****/
import { UseMutationOptions, useMutation } from "@tanstack/react-query"

/***** API IMPORTS *****/
import { API } from "../api"
import { TUsernameAvailabilityArgs } from "../apis/account"

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.POST.usernameAvailability>>
type TOptions  = Omit<UseMutationOptions<TReturnType, Error, TUsernameAvailabilityArgs, unknown>, 'mutationFn'> | undefined

/***** HOOK START *****/
export const useCheckUsernameAvailabilityMutation = (options: TOptions = {}) => {
  return useMutation({
    mutationFn: API.ACCOUNT.POST.usernameAvailability,
    mutationKey: ['application', 'unauthenticated', 'check-username-availability'],
    ...options
  })
}