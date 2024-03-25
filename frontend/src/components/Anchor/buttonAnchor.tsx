/***** BASE IMPORTS *****/
import React from "react";

/***** SHARED *****/
import { NButton } from "../button/_button";
import { _Anchor as Anchor } from "./_anchor";

/***** COMPONENT START *****/
export const _AnchorButton: React.FC<NButton.HrefProps> = (props) => {
  /***** RENDER *****/
  return <Anchor {...props} />
}