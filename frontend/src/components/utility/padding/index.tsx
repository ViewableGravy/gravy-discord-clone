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
  all?: number;
  inline?: boolean;
  block?: boolean;

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

  const styles = {
    ...( (top || all) && { '--padding-top': `${top ?? all ?? 0}px` }),
    ...( (left || all) && { '--padding-left': `${left ?? all ?? 0}px` }),
    ...( (right || all) && { '--padding-right': `${right ?? all ?? 0}px` }),
    ...( (bottom || all) && { '--padding-bottom': `${bottom ?? all ?? 0}px` }),
  } as React.CSSProperties

  /***** RENDER *****/
  return (
    <div className={_className} style={styles}>
      {children}
    </div>
  );
}
