/***** BASE IMPORTS *****/
import classNames from "classnames";

/***** CONSTS *****/
import "./ChatHeads.scss";
import { useState } from "react";
import { useToggleState } from "../../utilities/hooks/useToggleState";

/***** TYPE DEFINITIONS *****/
type TChatHeads = React.FC<{
  children: React.ReactNode;
  className?: string;
}>

/***** COMPONENT START *****/
export const ChatHeads: TChatHeads = ({ children, className }) => {
  /***** STATE *****/
  const [isHovered, setIsHovered] = useState(false);
  const [isToggled, toggle] = useToggleState();

  /***** RENDER HELPERS *****/
  const classes = {
    outer: classNames("ChatHeads", className),
    icon: classNames("ChatHeads__icon", {
      "ChatHeads__icon--hovered": isHovered || isToggled,
    }),
    selected: classNames("ChatHeads__selected", {
      "ChatHeads__selected--hovered": isHovered,
      "ChatHeads__selected--toggled": isToggled
    })
  }

  /***** RENDER *****/
  return (
    <div className={classes.outer}>
      <label 
        className={classes.icon} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        <input type="checkbox" checked={isHovered} onChange={() => toggle()} className="ChatHeads__input" />
        {children}
      </label>
      <div className={classes.selected} />
    </div>
  );
}
