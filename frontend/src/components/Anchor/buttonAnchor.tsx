import React from "react";
import { NButton } from "../button/_button";
import { _Anchor as Anchor } from "./_anchor";


export const _AnchorButton: React.FC<NButton.HrefProps> = (props) => {
  return <Anchor {...props} />
}