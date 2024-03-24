import { NButton } from "../button/_button";
import { _Anchor as Anchor } from "./_anchor";

export const _AnchorLink: React.FC<NButton.ToProps> = (props) => {
  return <Anchor {...props} />
}