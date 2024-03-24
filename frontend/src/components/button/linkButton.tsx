import React from "react";
import { _Button as Button, NButton } from "./_button";

export const _ButtonLink: React.FC<NButton.ToProps> = ({ children, ...props }) => {
  return (
    <Button {...props}>
        {children}
    </Button>
  );
};