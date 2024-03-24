import { Link } from "@tanstack/react-router";
import React, { CSSProperties } from "react"
import "./_Button.scss";
import classNames from "classnames";
import { TTheme, useTheme } from "../../utilities/hooks/useTheme";

/***** TYPE DEFINTIONS *****/
export namespace NButton {
  type BaseProps = {
    children: React.ReactNode;
    className?: string;

    /**
     * The size of the button
     */
    size?: 'small' | 'medium' | 'large';

    /**
     * If true, the button will take up the full width of the parent container
     */
    full?: boolean;

    style?: CSSProperties;
  }

  export type OnClickProps = BaseProps & {
    onClick: () => void;
    type?: 'button' | 'reset'; 
  }

  export type SubmitProps = BaseProps & {
    type?: 'submit';
  }

  export type HrefProps = BaseProps & {
    href: string;
  }

  export type ToProps = BaseProps & {
    to: string;
  }

  export type Props = OnClickProps | HrefProps | ToProps | SubmitProps
}

const utilities = {
  getHeight(size: NButton.Props['size']){
    switch (size) {
      case 'small':
        return '38px';
      case 'medium': 
        return '40px';
      case 'large': 
      default: 
        return '44px';
    }
  },
  getWidth(full: NButton.Props['full']){
    return full ? '100%' : `${200}px`;
  }
}

/***** COMPONENT START *****/
/**
 * Button component providing the base functionality for a button, link, or anchor tag.
 * The styling for the Anchor and Link tag are provided as compound components to the Button
 */
export const _Button: React.FC<NButton.Props> = ({ children, className, style, full, size = 'large', ...props }) => {
  const [{ backgroundColor, color }] = useTheme()

  const _style = {
    '--height': utilities.getHeight(size),
    '--width': utilities.getWidth(full),
    '--background-color': backgroundColor.button,
    '--background-color--hover': backgroundColor.hover.button,
    '--color': color.primary,
    ...style
  } as CSSProperties;

  switch (true) {
    case "href" in props: {
      const { href } = props
      return (
        <a href={href} className={classNames("Button", className)} style={_style}>
          {children}
        </a>
      );
    }
    case "to" in props: {
      const { to } = props
      return (
        <Link to={to} className={classNames("Button", className)} style={_style}>
          {children}
        </Link>
      );
    }
    case "onClick" in props: {
      const { onClick, type } = props
      return (
        <button type={type} onClick={onClick} className={classNames("Button", className)} style={_style}>
          {children}
        </button>
      );
    }
    case "type" in props && props.type === 'submit': {
      const { type } = props;
      return (
        <button type={type} className={classNames("Button", className)} style={_style}>
          {children}
        </button>
      )
    }
    default: {
      return null
    }
  }
}