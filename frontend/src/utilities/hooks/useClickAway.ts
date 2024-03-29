import { useEffect, useLayoutEffect, useRef } from "react";

export const useClickAway = <E>(cb: (e: MouseEvent | TouchEvent) => void) => {
  const ref = useRef<E>(null);
  const callbackRef = useRef(cb);

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

  return ref;
}