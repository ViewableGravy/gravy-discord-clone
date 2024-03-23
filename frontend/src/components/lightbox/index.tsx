import React, { CSSProperties } from "react"
import { useTheme } from "../../utilities/hooks/useTheme"
import classNames from "classnames"

import './_Lightbox.scss';

type TLightbox = React.FC<{
  isOpen: boolean,
  children: React.ReactNode,
  backgroundColor?: string,
  className?: string
}>

export const Lightbox: TLightbox = ({ backgroundColor, isOpen, children, className }) => {
  const [{ primary }] = useTheme((theme) => theme.backgroundColor)

  const style = {
    '--lightbox-background-color': backgroundColor ?? primary,
    '--z-index': 9999
  } as CSSProperties

  return (
    <>
      {isOpen && (
        <div style={style} className={classNames("Lightbox", className)}>
          {children}
        </div>
      )}
    </>
  )

}