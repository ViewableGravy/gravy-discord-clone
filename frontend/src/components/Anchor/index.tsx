import { _AnchorButton } from "./buttonAnchor";
import { _AnchorLink } from "./linkAnchor";
import { _Anchor } from "./_anchor";

export const Anchor = Object.assign(_Anchor, {
  Button: _AnchorButton,
  Link: _AnchorLink,
})