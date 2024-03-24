import React from "react"
import classNames from "classnames";
import { useTheme } from "../../utilities/hooks/useTheme";
import { NButton } from "../button/_button";
import { Button } from "../button";
import { Text } from "../utility/text";

import "./_Anchor.scss";


/***** COMPONENT START *****/
/**
 * Button component providing the base functionality for a button, link, or anchor tag.
 * The styling for the Anchor and Link tag are provided as compound components to the Button
 */
export const _Anchor: React.FC<NButton.Props> = ({ className, ...props }) => {
  const [{ link }] = useTheme(({ color }) => color);
  
  const style = {
    '--anchor-color': link,
  } as React.CSSProperties;
  const _className = classNames("Anchor", className)

  return (
    <span style={style}>
      <Text span link>
        <Button {...props} className={_className} />
      </Text>
    </span>
  );
}
