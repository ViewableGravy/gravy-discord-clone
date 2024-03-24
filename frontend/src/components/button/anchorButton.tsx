import React from "react";
import { _Button as Button, NButton } from "./_button";

export const _ButtonAnchor: React.FC<NButton.HrefProps> = (props) => {
  return (
    <Button {...props} />
  );
};