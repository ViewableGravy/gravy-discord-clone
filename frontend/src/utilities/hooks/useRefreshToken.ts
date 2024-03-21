/***** UTILITIES *****/
import { useLocalStorage } from "./useLocalStorage";

/**
 * A simple abstraction over useLocalStorage that allows easy access to the refresh token
 */
export const useRefreshToken = () => useLocalStorage<undefined | string>('refreshToken', undefined, { deserializer: (value) => {
  if (value === 'undefined') {
    return undefined; 
  }

  return value;
}});