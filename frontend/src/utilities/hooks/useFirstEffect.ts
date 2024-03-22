/***** BASE IMPORTS *****/
import { useEffect, useRef } from "react"

/***** HOOK START *****/
export const useFirstEffect = (callback: () => void, condition: boolean) => {
  /***** STATE *****/
  const hasConditionBeenMet = useRef(false);

  /***** EFFECTS *****/
  useEffect(() => {
    if (!hasConditionBeenMet.current && condition) {
      hasConditionBeenMet.current = true
      callback();
    }
  }, [condition]);
}