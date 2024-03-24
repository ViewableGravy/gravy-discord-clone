import classNames from "classnames";
import React from "react"

import './_Flex.scss';

type TFlexDirections = {
  row?: boolean;
  column?: boolean;
}

type TFlexWrap = {
  wrap?: boolean;
  nowrap?: boolean;
}

type TBaseFlexProps = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  align?: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch';
  justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

type TFlex = React.FC<TFlexDirections & TFlexWrap & TBaseFlexProps>


export const Flex: TFlex = ({ className, style, children, align, justify, ...props }) => {
  const classes = classNames('Flex', className, Object
    .entries(props)
    .filter(([,value]) => Boolean(value))
    .map(([key]) => `Flex--${key}`), {
      [`Flex--align-${align}`]: align,
      [`Flex--justify-${justify}`]: justify
    }
  );

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
