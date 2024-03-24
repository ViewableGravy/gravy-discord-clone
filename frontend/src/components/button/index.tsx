import { _ButtonAnchor } from "./anchorButton";
import { _ButtonLink } from "./linkButton";
import { _Button } from "./_button";

export const Button = Object.assign(_Button, {
  Anchor: _ButtonAnchor, 
  Link: _ButtonLink,
}) 
