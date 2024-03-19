import { useEffect, useRef } from "react"


export const useFirstEffect = (callback: () => void, condition: boolean) => {
  const hasConditionBeenMet = useRef(false);

  useEffect(() => {
    if (!hasConditionBeenMet.current && condition) {
      hasConditionBeenMet.current = true
      callback();
    }
  }, [condition]);
}