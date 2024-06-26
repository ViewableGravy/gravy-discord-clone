/***** CONSTS *****/
import classNames from 'classnames';
import './_Text.scss'

/***** TYPE DEFINITIONS *****/
import { TTextComponent } from "./types";
import { useTheme } from '../../../utilities/hooks/useTheme';
import { CSSProperties } from 'react';

/***** COMPONENT START *****/
export const Text: TTextComponent = ({ children, className, span, div, ...props }) => {
  /***** HOOKS *****/
  const [_color] = useTheme((theme) => {
    const colorKey = Object
      .entries(props)
      .filter(([,value]) => Boolean(value))
      .find(([key]) => Object.keys(theme.color).includes(key))?.[0] as keyof typeof theme.color | undefined

    if (props.inherit) {
      return 'inherit'
    }

    return colorKey ? theme.color[colorKey] : undefined
  })
  
  /***** RENDER HELPERS *****/
  const classes = classNames('Text', className, Object
    .entries(props)
    .filter(([,value]) => Boolean(value))
    .map(([key]) => `Text--${key}`)
  );

  const style = {
    '--color': _color ?? 'inherit'
  } as CSSProperties

  const _props = {
    className: classes,
    style
  }

  /***** RENDER *****/
  switch (true) {
    case span:
      return <span {..._props}>{children}</span>
    case div:
      return <div {..._props}>{children}</div>
    default:
      return <p {..._props}>{children}</p>
  }
}
