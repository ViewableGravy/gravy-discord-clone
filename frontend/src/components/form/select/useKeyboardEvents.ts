import { useEffect } from "react";
import { useDownKeys } from "../../../utilities/hooks/useKeysDown";

type TUseSelectFieldKeyboardStateProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  toggleIsSearching: (state?: boolean) => void;
  toggleIsOpen: (state?: boolean) => void;
}

type TUseSelectFieldKeyboardState = (props: TUseSelectFieldKeyboardStateProps) => void;

export const useSelectFieldKeyboardEffect: TUseSelectFieldKeyboardState = ({
  inputRef,
  toggleIsSearching,
  toggleIsOpen
}) => {
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