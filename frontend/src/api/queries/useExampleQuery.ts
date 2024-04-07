/***** BASE IMPORTS *****/
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

/***** UTILITIES *****/
import { useAuthorizationSocket } from "../../utilities/hooks/useSocket";

/***** API IMPORTS *****/
import { API } from "../api";

/***** TYPE DEFINITIONS *****/
type TReturnType = Awaited<ReturnType<typeof API.ACCOUNT.GET.example>>
type TOptions = Omit<Omit<UseQueryOptions<TReturnType, Error, unknown>, 'queryFn'>, 'queryKey'> & { queryKey?: string[] }
type TExampleQuery = (options?: TOptions) => ReturnType<typeof useQuery>

/***** HOOK START *****/
export const useExampleQuery: TExampleQuery = ({ queryKey = [], ...rest } = {}) => {
  const { readyState, useJoinRoomEffect } = useAuthorizationSocket((state) => ({
    readyState: state.readyState
  }));
  
  useJoinRoomEffect(['invalidate/example'], [readyState])

  /***** RENDER *****/
  return useQuery({
    staleTime: 10000,
    queryFn: API.ACCOUNT.GET.example,
    queryKey: ['example', ...queryKey],
    ...rest
  })
}; 
