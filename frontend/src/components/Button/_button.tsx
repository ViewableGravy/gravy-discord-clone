import { Link } from "@tanstack/react-router";
import React from "react"
import "./_Button.scss";
import classNames from "classnames";

/***** TYPE DEFINTIONS *****/
export namespace NButton {
  export type OnClickProps = {
    children: React.ReactNode;
    onClick: () => void;
    type?: 'button' | 'reset' | 'submit'; 
    className?: string;
  }

  export type HrefProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
  }

  export type ToProps = {
    to: string;
    children: React.ReactNode;
    className?: string;
  }

  export type Props = OnClickProps | HrefProps | ToProps
}

/***** COMPONENT START *****/
/**
 * Button component providing the base functionality for a button, link, or anchor tag.
 * The styling for the Anchor and Link tag are provided as compound components to the Button
 */
export const _Button: React.FC<NButton.Props> = ({ children, className, ...props }) => {
  switch (true) {
    case "href" in props: {
      const { href } = props
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    }
    case "to" in props: {
      const { to } = props
      return (
        <Link to={to} className={className}>
          {children}
        </Link>
      );
    }
    case "onClick" in props: {
      const { onClick, type } = props
      return (
        <button type={type} onClick={onClick} className={classNames("Button", className)}>
          {children}
        </button>
      );
    }
    default: {
      return null
    }
  }
}