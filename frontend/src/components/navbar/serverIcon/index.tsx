/***** BASE IMPORTS *****/
import classNames from "classnames";

/***** CONSTS *****/
import "./_ServerIcon.scss";
import { useEffect, useId, useState } from "react";
import { useNavbar } from "../_navbar";

/***** TYPE DEFINITIONS *****/
type TChatHeads = React.FC<{
  children: React.ReactNode;
  className?: string;
  onActive?: () => void;
}>

/***** COMPONENT START *****/
export const NavbarServerIcon: TChatHeads = ({ children, className, onActive }) => {
  /***** HOOKS *****/
  const id = useId();
  const { setActiveServer, isActiveServer } = useNavbar(id);

  /***** STATE *****/
  const [isHovered, setIsHovered] = useState(false);

  /***** EFFECTS *****/
  useEffect(() => void (onActive && isActiveServer && onActive()), [isActiveServer])

  /***** RENDER HELPERS *****/
  const classes = {
    outer: classNames("ChatHeads", className),
    icon: classNames("ChatHeads__icon", {
      "ChatHeads__icon--hovered": isHovered || isActiveServer,
    }),
    selected: classNames("ChatHeads__selected", {
      "ChatHeads__selected--hovered": isHovered,
      "ChatHeads__selected--toggled": isActiveServer
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
        <input type="checkbox" checked={isActiveServer} onChange={setActiveServer} className="ChatHeads__input" />
        {children}
      </label>
      <div className={classes.selected} />
    </div>
  );
}
