/***** BASE IMPORTS *****/
import classNames from "classnames";
import React, { CSSProperties } from "react"

/***** CONSTS *****/
import './_Flex.scss';

/***** TYPE DEFINITIONS *****/
type TFlexDirections = {
  row?: boolean;
  column?: boolean;
}

type TFlexWrap = {
  wrap?: boolean;
  nowrap?: boolean;
}

type TFlexGap = {
  gap?: number;
  rowGap?: number;
  columnGap?: number;
}

type TBaseFlexProps = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  align?: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch';
  justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

type TFlex = React.FC<TFlexDirections & TFlexWrap & TFlexGap & TBaseFlexProps>

/***** COMPONENT START *****/
export const Flex: TFlex = ({ className, style, children, align, justify, gap, columnGap, rowGap, ...props }) => {
  /***** RENDER HELPERS *****/
  const classes = classNames('Flex', className, Object
    .entries(props)
    .filter(([,value]) => Boolean(value))
    .map(([key]) => `Flex--${key}`), {
      [`Flex--align-${align}`]: align,
      [`Flex--justify-${justify}`]: justify
    }
  );

  const styles = {
    '--gap': gap ? `${gap}px` : 'unset',
    '--column-gap': columnGap ? `${columnGap}px` : 'unset',
    '--row-gap': rowGap ? `${rowGap}px` : 'unset'
  } as CSSProperties

  /***** RENDER *****/
  return (
    <div className={classes} style={{ ...style, ...styles }}>
      {children}
    </div>
  );
}
