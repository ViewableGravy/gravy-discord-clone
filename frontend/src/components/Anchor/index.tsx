/***** SHARED *****/
import { _AnchorButton } from "./buttonAnchor";
import { _AnchorLink } from "./linkAnchor";
import { _Anchor } from "./_anchor";

/***** COMPONENT START *****/
export const Anchor = Object.assign(_Anchor, {
  Button: _AnchorButton,
  Link: _AnchorLink,
})