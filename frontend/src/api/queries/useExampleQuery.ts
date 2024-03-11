import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { API } from "../api";
import { useSocket } from "../../utilities/hooks/useSocket";
import { useEffect } from "react";

type TReturnType = Awaited<ReturnType<typeof API.APP.GET.example>>
type TOptions = UseQueryOptions<TReturnType, Error, unknown>

export const useExampleQuery = ({ queryKey, ...rest }: TOptions) => {
  const { joinRoom, readyState } = useSocket();
  
  useEffect(() => {
    if (readyState === 'READY') {
      joinRoom(['invalidate/example']) 
    }
  }, [readyState])

  return useQuery({
    queryFn: API.APP.GET.example,
    queryKey: ['socket', 'example', ...queryKey],
    ...rest
  })
}; 
