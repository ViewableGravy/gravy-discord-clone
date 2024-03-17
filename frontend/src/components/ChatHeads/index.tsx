/***** BASE IMPORTS *****/
import classNames from "classnames";

/***** CONSTS *****/
import "./ChatHeads.scss";
import { useState } from "react";

/***** TYPE DEFINITIONS *****/
type TChatHeads = React.FC<{
  children: React.ReactNode;
  className?: string;
}>

/***** COMPONENT START *****/
export const ChatHeads: TChatHeads = ({ children, className }) => {
  /***** STATE *****/
  const [isHovered, setIsHovered] = useState(false);

  /***** RENDER HELPERS *****/
  const classes = {
    outer: classNames("ChatHeads", className),
    icon: classNames("ChatHeads__icon", {
      "ChatHeads__icon--hovered": isHovered
    }),
    selected: classNames("ChatHeads__selected", {
      "ChatHeads__selected--hovered": isHovered
    })
  }

  /***** RENDER *****/
  return (
    <div className={classes.outer}>
        <div 
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)} 
          className={classes.icon}
        >
          {children}
        </div>
        <div className={classes.selected} />
    </div>
  );
}
