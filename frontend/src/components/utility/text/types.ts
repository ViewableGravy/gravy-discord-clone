/***** BASE IMPORTS *****/
import React from "react";

/***** CONSTS *****/
import { theme } from "../../../utilities/hooks/useTheme";

/***** TYPE DEFINITIONS *****/
type TTheme = TCustomStore<typeof theme>
type TSizes = {
  /**
   * 10px
   */
  xxs?: boolean;

  /**
   * 11px
   */
  xs?: boolean;

  /**
   * 12px
   */
  sm?: boolean;

  /**
   * 14px
   */
  md?: boolean;

  /**
   * 16px
   */
  lg?: boolean;

  /**
   * 18px
   */
  xl?: boolean;

  /**
   * 20px
   */
  xxl?: boolean;

  /**
   * 24px
   */
  xxxl?: boolean;
}
type TAlignment = {
  /**
   * Aligns the text to the left
   */
  'align-left'?: boolean;

  /**
   * Aligns the text to the center
   */
  'align-center'?: boolean;

  /**
   * Aligns the text to the right
   */
  'align-right'?: boolean;
}
type TWeights = {
  /**
   * 400
   */
  normal?: boolean;

  /**
   * 500
   */
  medium?: boolean;

  /**
   * 600
   */
  semiBold?: boolean;

  /**
   * 700
   */
  bold?: boolean;

}

export type TTextComponent = React.FC<
  TSizes 
  & TAlignment 
  & TWeights 
  & Partial<Record<keyof TTheme['color'], boolean>> 
  & {
    /**
     * Content of the text
     */
    children: React.ReactNode;

    /**
     * Additional class name
     */
    className?: string;

    /**
     * Whether or not the text should be rendered in a div internally
     */
    span?: boolean;

    /**
     * Whether or not the text should be rendered in a span internally
     */
    div?: boolean;
}>

