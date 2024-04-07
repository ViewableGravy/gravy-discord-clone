/***** BASE IMPORTS *****/
import { useEffect } from "react";

/***** UTILITIES *****/
import { useDownKeys } from "../../../utilities/hooks/useKeysDown";

/***** TYPE DEFINITIONS *****/
type TUseSelectFieldKeyboardStateProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  toggleIsSearching: (state?: boolean) => void;
  toggleIsOpen: (state?: boolean) => void;
}

type TUseSelectFieldKeyboardState = (props: TUseSelectFieldKeyboardStateProps) => void;

/***** HOOK START *****/
export const useSelectFieldKeyboardEffect: TUseSelectFieldKeyboardState = ({
  inputRef,
  toggleIsSearching,
  toggleIsOpen
}) => {
  /***** HOOKS *****/
  const [keys] = useDownKeys();

  /***** EFFECTS *****/
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      if (keys.Tab && keys.Shift) {
        toggleIsOpen(false);
        toggleIsSearching(false);
      }
    }
  }, [keys])
}