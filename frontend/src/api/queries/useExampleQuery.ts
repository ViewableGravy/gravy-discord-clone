import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { API } from "../api";
import { useSocket } from "../../utilities/hooks/useSocket";

type TReturnType = Awaited<ReturnType<typeof API.APP.GET.example>>
type TOptions = Omit<Omit<UseQueryOptions<TReturnType, Error, unknown>, 'queryFn'>, 'queryKey'> & { queryKey?: string[] }

type TExampleQuery = (options?: TOptions) => ReturnType<typeof useQuery>

export const useExampleQuery: TExampleQuery = ({ queryKey = [], ...rest } = {}) => {
  const { readyState, joinRoomEffect } = useSocket();
  
  joinRoomEffect(['invalidate/example'], [readyState])

  return useQuery({
    staleTime: 100,
    queryFn: API.APP.GET.example,
    queryKey: ['example', ...queryKey],
    ...rest
  })
}; 
