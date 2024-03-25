/***** SHARED *****/
import { NButton } from "../button/_button";
import { _Anchor as Anchor } from "./_anchor";

/***** COMPONENT START *****/
export const _AnchorLink: React.FC<NButton.ToProps> = (props) => {
  /***** RENDER *****/
  return <Anchor {...props} />
}