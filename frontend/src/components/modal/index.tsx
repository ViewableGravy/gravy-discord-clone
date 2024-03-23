/***** CONSTS *****/
import React, { CSSProperties } from 'react';
import { TTheme, theme, useTheme } from '../../utilities/hooks/useTheme';
import './_Modal.scss';
import classNames from 'classnames';
import { Lightbox } from '../lightbox';

/***** TYPE DEFINITIONS *****/
type TModal = React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
  fade?: {
    modal?: boolean;
    content?: boolean;
  },

  /**
   * Element that is rendered between the modal content and the lightbox
   */
  background?: React.ReactNode
}>

/***** COMPONENT START *****/
export const Modal: TModal = ({ children, isOpen, fade, className, background }) => {
  const [{ modal }] = useTheme(({ backgroundColor}) => backgroundColor)

  const style = {
    '--modal-content-background-color': modal,
    zIndex: 2
  } as CSSProperties;

  const classes = {
    modal: classNames('Modal', className, {
      'Modal--fadeIn': fade?.modal ?? true,
    }),
    content: classNames('Modal__content', {
      'Modal__content--fadeIn': fade?.content ?? true,
    })
  }

  return (
    <Lightbox isOpen={isOpen}>
      {!!background && background}
      <div className={classes.content} style={style}>
        {children}
      </div>
    </Lightbox>
  )
};
