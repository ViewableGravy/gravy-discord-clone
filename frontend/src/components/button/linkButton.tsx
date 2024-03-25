/***** BASE IMPORTS *****/
import React from "react";

/***** SHARED *****/
import { _Button as Button, NButton } from "./_button";

/***** COMPONENT START *****/
export const _ButtonLink: React.FC<NButton.ToProps> = ({ children, ...props }) => {
  /***** RENDER *****/
  return (
    <Button {...props}>
        {children}
    </Button>
  );
};