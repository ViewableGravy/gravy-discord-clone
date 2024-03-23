import React from "react";
import { _Button as Button, NButton } from "../_button";
import "./_Anchor.scss";
import { useTheme } from "../../../utilities/hooks/useTheme";

export const _ButtonAnchor: React.FC<NButton.HrefProps> = (props) => {
  const [{ link }] = useTheme(({ color }) => color);

  const style = {
    '--anchor-color': link,
  } as React.CSSProperties;

  return (
    <div style={style}>
      <Button {...props} className="ButtonAnchor" />
    </div>
  );
};