import { Store, useStore } from "@tanstack/react-store";

type TUseTheme = TUseSpecificStoreTuple<TCustomStore<typeof theme>>

const theme = new Store({
  backgroundColor: {
    navbar: '#1e1f22',
    sidebar: '#2b2d31'
  }
})

export const useTheme: TUseTheme = (selector) => [useStore(theme, selector), theme.setState]
