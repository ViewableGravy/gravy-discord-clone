import React from "react";
import { _Button as Button, NButton } from "../_button";
import "./_Anchor.scss";

export const _ButtonAnchor: React.FC<NButton.HrefProps> = (props) => {
  return (
    <Button {...props} className="ButtonAnchor" />
  );
};