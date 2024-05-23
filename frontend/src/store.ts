import { Store, useStore } from "@tanstack/react-store";

type UseAppStore = TUseSpecificStore<TCustomStore<typeof appStore>>

export const appStore = new Store({
  initialized: false
});

export const useAppStore: UseAppStore = (selector = (s) => s as any) => useStore(appStore, selector);