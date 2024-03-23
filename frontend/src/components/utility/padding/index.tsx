/***** BASE IMPORTS *****/
import classNames from "classnames";
import React from "react"

/***** CONSTS *****/
import './_Padding.scss';

/***** TYPE DEFINITIONS *****/
type TPadding = React.FC<{
  margin?: boolean;

  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  inline?: boolean;
  block?: boolean;
  all?: boolean;

  className?: string;
  children: React.ReactNode;
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

  const styles = {
    ...( top && { '--padding-top': `${top}px` }),
    ...( left && { '--padding-left': `${left}px` }),
    ...( right && { '--padding-right': `${right}px` }),
    ...( bottom && { '--padding-bottom': `${bottom}px` }),
  } as React.CSSProperties

  /***** RENDER *****/
  return (
    <div className={_className} style={styles}>
      {children}
    </div>
  );
}
