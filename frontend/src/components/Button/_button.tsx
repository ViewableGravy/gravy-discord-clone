import { Link } from "@tanstack/react-router";
import React from "react"
import "./_Button.scss";
import classNames from "classnames";

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


export const _Button: React.FC<NButton.Props> = ({ children, className, ...props }) => {

  if ("onClick" in props) {
    const { onClick, type } = props
    return (
      <button type={type} onClick={onClick} className={classNames("Button", className)}>
        {children}
      </button>
    );
  };

  if ("href" in props) {
    const { href } = props
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };

  if ("to" in props) {
    const { to } = props
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );

  };

  return (
    <div>
      <h1>Button</h1>
    </div>
  )
}