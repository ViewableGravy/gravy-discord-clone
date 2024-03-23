import { _ButtonAnchor } from "./Anchor";
import { _ButtonLink } from "./Link";
import { _Button } from "./_button";

export const Button = Object.assign(_Button, {
  Anchor: _ButtonAnchor, 
  Link: _ButtonLink,
}) 
