/***** BASE IMPORTS *****/
import React from "react";

/***** SHARED *****/
import { _Button as Button, NButton } from "./_button";

/***** COMPONENT START *****/
export const _ButtonAnchor: React.FC<NButton.HrefProps> = (props) => {
  /***** RENDER *****/
  return (
    <Button {...props} />
  );
};