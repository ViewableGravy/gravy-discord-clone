/***** BASE IMPORTS *****/
import { useEffect, useLayoutEffect, useRef } from "react";

/***** HOOK START *****/
export const useClickAway = <E>(cb: (e: MouseEvent | TouchEvent) => void) => {
  /***** STATE *****/
  const ref = useRef<E>(null);
  const callbackRef = useRef(cb);

  /***** EFFECTS *****/
  useLayoutEffect(() => {
    callbackRef.current = cb;
  });

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const element = ref.current as any;
      if (element && !element.contains(e.target)) {
        callbackRef.current(e);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  /***** HOOK RESULTS *****/
  return ref;
}
