import { Store, useStore } from "@tanstack/react-store";

type TUseTheme = TUseSpecificStoreTuple<TCustomStore<typeof theme>>

const theme = new Store({
  backgroundColor: {
    primary: '#2b2d31',
    navbar: '#1e1f22',
    input: '#1e1f22',
    button: '#5865f2',
    hover: {
      button: '#4752c4'
    }
  },
  color: {
    primary: '#f2f3f5',
    secondary: '#b5bac1',
  }
})

export const useTheme: TUseTheme = (selector) => [useStore(theme, selector), theme.setState]
