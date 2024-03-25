/***** BASE IMPORTS *****/
import { useLayoutEffect, useState } from "react";

/***** TYPE DEFINITIONS *****/
type TUseMatchMediaProps = { min?: number, max?: number }
type TUseMatchMedia = (props: TUseMatchMediaProps) => boolean

/***** COMPONENT START *****/
/**
 * hook returning a boolean based on the current viewport size. 
 * If no min or max is provided, it will always return true
 */
export const useMatchMedia: TUseMatchMedia = ({ min, max }) => {
  /***** STATE *****/
  const [isMatch, setIsMatch] = useState(false);  

  /***** EFFECTS *****/
  useLayoutEffect(() => {
    const queries = [];
    min && queries.push(`(min-width: ${min}px)`);
    max && queries.push(`(max-width: ${max}px)`);

    const mediaQuery = window.matchMedia(queries.join(' and '));
    setIsMatch(mediaQuery.matches);
    
    const listener = () => setIsMatch(mediaQuery.matches);
    const legacySafariListener = (e: any) => setIsMatch(!!e.matches);

    /** Handle safari 13 */
    if (typeof mediaQuery?.removeListener === 'function') {
      mediaQuery.addListener(legacySafariListener);
    
      return () => mediaQuery.removeListener(legacySafariListener);
    }
  
    mediaQuery.addEventListener('change', listener);
  
    return () => mediaQuery.removeEventListener('change', listener);
  }, [min, max]);

  /***** HOOK RESULTS *****/
  if (!min && !max)
    return true;

  return isMatch;
};