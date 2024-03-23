/***** BASE IMPORTS *****/
import React, { CSSProperties } from "react"
import classNames from "classnames"

/***** UTILITIES *****/
import { useTheme } from "../../utilities/hooks/useTheme"

/***** CONSTS *****/
import './_Lightbox.scss';

/***** TYPE DEFINITIONS *****/
type TLightbox = React.FC<{
  isOpen: boolean,
  children: React.ReactNode,
  backgroundColor?: string,
  className?: string,
  fadeIn?: boolean
}>

/***** COMPONENT START *****/
export const Lightbox: TLightbox = ({ backgroundColor, isOpen, children, className, fadeIn }) => {
  /***** HOOKS *****/
  const [{ primary }] = useTheme((theme) => theme.backgroundColor)

  /***** RENDER HELPERS *****/
  const style = {
    '--lightbox-background-color': backgroundColor ?? primary,
    '--z-index': 9999
  } as CSSProperties

  const classes = classNames("Lightbox", className, {
    "Lightbox--fadeIn": fadeIn
  })

  /***** CONSTS *****/
  return (
    <>
      {isOpen && (
        <div style={style} className={classes}>
          {children}
        </div>
      )}
    </>
  )

}