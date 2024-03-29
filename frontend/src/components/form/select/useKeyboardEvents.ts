import { useEffect, useLayoutEffect, useState } from "react";
import { useDownKeys } from "../../../utilities/hooks/useKeysDown";
import { useSelectContext } from ".";

type TUseSelectFieldKeyboardStateProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  clickawayRef: React.RefObject<HTMLDivElement>;
  isSearching: boolean;
  toggleIsSearching: (state?: boolean) => void;
  toggleIsOpen: (state?: boolean) => void;
}

type TUseOptionFieldKeyboardStateProps = {
  buttonRef: React.RefObject<HTMLButtonElement>;
}

type TUseOptionFieldKeyboardState = (props: TUseOptionFieldKeyboardStateProps) => void;
type TUseSelectFieldKeyboardState = (props: TUseSelectFieldKeyboardStateProps) => void;

export const useSelectFieldKeyboardState: TUseSelectFieldKeyboardState = ({
  inputRef,
  isSearching,
  toggleIsSearching,
  toggleIsOpen
}) => {
  const [keys] = useDownKeys();

  /***** EFFECTS *****/
  useEffect(() => {
    if (document.activeElement !== inputRef.current)
      return;

    if (keys.Tab && keys.Shift) {
      toggleIsOpen(false);
      toggleIsSearching(false);
      return;
    }

    if (keys.Tab) {
      return;
    }

    if (!isSearching) {
      toggleIsSearching(true)
    }
  }, [keys])
}


export const useOptionFieldKeyboardState: TUseOptionFieldKeyboardState = ({ buttonRef }) => {
  const { inputRef } = useSelectContext();
  const [keys] = useDownKeys();
  const [clickedArrowDown, setClickedArrowDown] = useState(false)
  const [clickedArrowUp, setclickedElementUp] = useState(false) 

  useEffect(() => {
    if (document.activeElement !== buttonRef.current)
      return;

    if (keys.ArrowDown) {
      setClickedArrowDown(true)
    };

    if (keys.ArrowUp) {
      setclickedElementUp(true)
    }
  }, [keys])

  useLayoutEffect(() => {
    if (!clickedArrowDown) return;

    const nextElement = buttonRef.current?.nextElementSibling;

    if (nextElement instanceof HTMLElement) {
      nextElement.focus();
    }

    setClickedArrowDown(false)
  }, [clickedArrowDown])

  useLayoutEffect(() => {
    if (!clickedArrowUp) return;

    const prevElement = buttonRef.current?.previousElementSibling;

    if (prevElement instanceof HTMLElement) {
      prevElement.focus();
    }

    if (!prevElement) {
      inputRef.current?.focus();
    }

    setclickedElementUp(false)
  }, [clickedArrowUp])
  
}