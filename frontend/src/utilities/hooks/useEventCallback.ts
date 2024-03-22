/***** BASE IMPORTS *****/
import { useCallback, useLayoutEffect, useRef } from 'react'

/***** HOOK START *****/
/**
 * useEventCallback - Custom hook that creates a memoized event callback.
 */
export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R,
): (...args: Args) => R {
  /***** STATE *****/
  const ref = useRef<typeof fn>(() => {
    throw new Error('Cannot call an event handler while rendering.')
  })

  /***** EFFECTS *****/
  useLayoutEffect(() => {
    ref.current = fn
  }, [fn])

  /***** RENDER *****/
  return useCallback((...args: Args) => ref.current(...args), [ref])
}