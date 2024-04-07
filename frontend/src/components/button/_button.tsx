/***** BASE IMPORTS *****/
import React, { CSSProperties } from "react"
import { Link } from "@tanstack/react-router";
import classNames from "classnames";

/***** UTILITIES *****/
import { useTheme } from "../../utilities/hooks/useTheme";

/***** CONSTS *****/
import "./_Button.scss";

/***** TYPE DEFINTIONS *****/
export namespace NButton {
  type BaseProps = {
    children: React.ReactNode;
    className?: string;
    style?: CSSProperties;

    /**
     * The size of the button
     */
    size?: 'small' | 'medium' | 'large';

    /**
     * If true, the button will take up the full width of the parent container
     */
    full?: boolean;

    /**
     * If true, the button will be disabled. Note that this does not have an alternative appearance as per discords theming
     */
    disabled?: boolean;
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
  getHeight(size: NButton.Props['size']) {
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
  getWidth(full: NButton.Props['full']) {
    return full ? '100%' : `${200}px`;
  }
}

/***** COMPONENT START *****/
/**
 * Button component providing the base functionality for a button, link, or anchor tag.
 * The styling for the Anchor and Link tag are provided as compound components to the Button
 */
export const _Button: React.FC<NButton.Props> = ({ children, className, style, full, size = 'large', ...props }) => {
  /***** HOOKS *****/
  const [{ backgroundColor, color }] = useTheme()

  /***** RENDER HELPERS *****/
  const _style = {
    '--height': utilities.getHeight(size),
    '--width': utilities.getWidth(full),
    '--background-color': backgroundColor.button,
    '--background-color--hover': backgroundColor.hover.button,
    '--color': color.primary,
    ...style
  } as CSSProperties;

  const baseProps = {
    className: classNames("Button", className),
    style: _style,
    tabIndex: 0,
    "aria-disabled": props.disabled 
  }

  /***** RENDER *****/
  switch (true) {
    case "href" in props: {
      const { href } = props
      return (
        <a {...baseProps} href={href}>
          {children}
        </a>
      );
    }
    case "to" in props: {
      const { to } = props
      return (
        <Link {...baseProps} to={to}>
          {children}
        </Link>
      );
    }
    case "onClick" in props: {
      const { onClick, type, disabled } = props
      return (
        <button {...baseProps} onClick={onClick} type={type} disabled={disabled}>
          {children}
        </button>
      );
    }
    case "type" in props && props.type === 'submit': {
      const { type, disabled } = props;
      return (
        <button {...baseProps} type={type} disabled={disabled}>
          {children}
        </button>
      )
    }
    default: {
      return null
    }
  }
}