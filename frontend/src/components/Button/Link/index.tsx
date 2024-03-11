import React from "react";
import { _Button as Button, NButton } from "../_button";
import "./_Link.scss";

export const _ButtonLink: React.FC<NButton.ToProps> = (props) => {
  return (
    <Button {...props} className="ButtonLink" />
  );
};