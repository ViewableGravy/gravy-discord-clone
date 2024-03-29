/***** BASE IMPORTS *****/
import { Store, useStore } from "@tanstack/react-store";

/***** TYPE DEFINITIONS *****/
type TUseDownKeys = TUseSpecificStoreTuple<TCustomStore<typeof keyStore.store>>
export type TDownKeys = TCustomStore<typeof keyStore.store>; 

/***** COMPONENT START *****/
class KeyStore {
  store: Store<Record<string, boolean>>

  constructor(defaults: Record<string, boolean> = {}) {
    this.store = new Store(defaults)

    window.addEventListener('keydown', (e) => this.addKey(e.key))
    window.addEventListener('keyup', (e) => this.removeKey(e.key))
  }

  destroy() {
    window.removeEventListener('keydown', (e) => this.addKey(e.key))
    window.removeEventListener('keyup', (e) => this.removeKey(e.key))
  }

  addKey(key: string) {
    this.store.setState((prev) => ({ ...prev, [key]: true }))
  }

  removeKey(key: string) {
    this.store.setState((prev) => {
      const { [key]: _, ...rest } = prev
      return rest
    })
  }
}

const keyStore = new KeyStore();

export const useDownKeys: TUseDownKeys = (selector) => [useStore(keyStore.store, selector), keyStore.store.setState]
