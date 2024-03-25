/***** BASE IMPORTS *****/
import classNames from 'classnames';
import React, { CSSProperties } from 'react';

/***** UTILITIES *****/
import { useTheme } from '../../utilities/hooks/useTheme';

/***** SHARED *****/
import { Lightbox } from '../lightbox';

/***** CONSTS *****/
import './_Modal.scss';

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
  /***** HOOKS *****/
  const [{ modal }] = useTheme(({ backgroundColor}) => backgroundColor)

  /***** RENDER HELPERS *****/
  const style = {
    '--modal-content-background-color': modal,
    zIndex: 2
  } as CSSProperties;

  const classes = {
    modal: classNames('Modal', className, {
      'Modal--fadeIn': fade?.modal ?? true,
    }),
    content: classNames('Modal__content', {
      'Modal__content--fadeDown': fade?.content ?? true,
    })
  }

  /***** RENDER *****/
  return (
    <Lightbox isOpen={isOpen} className={classes.modal}>
      {!!background && background}
      <div className={classes.content} style={style}>
        {children}
      </div>
    </Lightbox>
  )
};
