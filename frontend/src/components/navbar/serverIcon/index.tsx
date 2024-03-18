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
  default?: boolean;
}>

/***** COMPONENT START *****/
export const NavbarServerIcon: TChatHeads = ({ children, className, onActive, default: _defaultSelected = false }) => {
  /***** HOOKS *****/
  const id = useId();
  const { setActiveServer, isActiveServer } = useNavbar(id);

  /***** STATE *****/
  const [isHovered, setIsHovered] = useState(false);

  /***** EFFECTS *****/
  useEffect(() => void (onActive && isActiveServer && onActive()), [isActiveServer])
  useEffect(() => void (_defaultSelected && setActiveServer()), [])

  /***** RENDER HELPERS *****/
  const classes = {
    outer: classNames("NavbarServerIcon", className),
    icon: classNames("NavbarServerIcon__icon", {
      "NavbarServerIcon__icon--hovered": isHovered || isActiveServer,
    }),
    selected: classNames("NavbarServerIcon__selected", {
      "NavbarServerIcon__selected--hovered": isHovered,
      "NavbarServerIcon__selected--toggled": isActiveServer
    }),
    input: "NavbarServerIcon__input"
  }

  /***** RENDER *****/
  return (
    <div className={classes.outer}>
      <label 
        className={classes.icon} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        <input type="checkbox" checked={isActiveServer} onChange={setActiveServer} className={classes.input} />
        {children}
      </label>
      <div className={classes.selected} />
    </div>
  );
}
