import React from "react";
import { _Button as Button, NButton } from "../_button";
import "./_Link.scss";
import { useTheme } from "../../../utilities/hooks/useTheme";
import { Text } from "../../utility/text";

export const _ButtonLink: React.FC<NButton.ToProps> = ({ children, ...props }) => {
  const [{ link }] = useTheme(({ color }) => color);

  const style = {
    '--color': link,
  } as React.CSSProperties;

  return (
    <Button {...props} style={style} className="ButtonLink">
      <Text span link>
        {children}
      </Text>
    </Button>
  );
};