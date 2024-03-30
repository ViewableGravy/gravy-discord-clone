/***** BASE IMPORTS *****/
import classNames from "classnames";
import React from "react"

/***** CONSTS *****/
import './_Padding.scss';

/***** TYPE DEFINITIONS *****/
type TSizes = "extra-small" | "small" | "medium" | "large" | number

type TPadding = React.FC<{
  margin?: boolean;

  top?: TSizes;
  left?: TSizes;
  right?: TSizes;
  bottom?: TSizes;
  all?: TSizes;
  inline?: TSizes;
  block?: TSizes;

  className?: string;
  children?: React.ReactNode;
}>

/***** COMPONENT START *****/
export const Padding: TPadding = ({ margin, top, left, right, bottom, inline, block, all, children, className }) => {
  /***** RENDER HELPERS *****/
  const _className = classNames('Padding', className, {
    'Padding--inline': inline,
    'Padding--block': block,
    'Padding--all': all,
    'Padding--top': top,
    'Padding--left': left,
    'Padding--right': right,
    'Padding--bottom': bottom,
    'Padding--margin': margin
  })

  const castPropToPixel = (prop?: TSizes) => {
    if (typeof prop === 'number') {
      return `${prop}px`
    }

    switch (prop) {
      case 'extra-small':
        return '4px';
      case 'small':
        return '8px';
      case 'medium':
        return '12px';
      case 'large':
        return '20px';
      default:
        return '0px';
    }
  }

  const styles = {
    ...( (top || all) && { '--padding-top': castPropToPixel(top ?? all) }),
    ...( (left || all) && { '--padding-left': castPropToPixel(left ?? all) }),
    ...( (right || all) && { '--padding-right': castPropToPixel(right ?? all) }),
    ...( (bottom || all) && { '--padding-bottom': castPropToPixel(bottom ?? all) }),
  } as React.CSSProperties

  /***** RENDER *****/
  return (
    <div className={_className} style={styles}>
      {children}
    </div>
  );
}
