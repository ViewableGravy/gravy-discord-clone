/***** BASE IMPORTS *****/
import { Store, useStore } from "@tanstack/react-store";

/***** TYPE DEFINITIONS *****/
type TUseTheme = TUseSpecificStoreTuple<TCustomStore<typeof theme>, typeof utilities>
export type TTheme = TCustomStore<typeof theme>;

/***** STORE *****/
export const theme = new Store({
  backgroundColor: {
    primary: '#2b2d31',
    navbar: '#1e1f22',
    input: '#1e1f22',
    modal: '#313338',
    button: '#5865f2',
    hover: {
      button: '#4752c4',
    },
    form: {
      input: '#1e1f22',
      select: {
        selected: '#404249',
        hover: '#35373c'
      }
    },
    black: '#000000',
  },
  color: {
    primary: '#f2f3f5',
    secondary: '#b5bac1',
    tertiary: '#949ba4',
    link: '#00a8fc',
    error: '#fa777c',
  }
} as const)

/***** UTILITIES *****/
const utilities = {
  opacity: (color: string, opacity: number) => {
    if (!opacity) 
      return color

    const [r, g, b] = color.match(/\w\w/g)!.map((hex) => parseInt(hex, 16))
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
}

export const useTheme: TUseTheme = (selector) => [useStore(theme, selector), utilities, theme.setState]
