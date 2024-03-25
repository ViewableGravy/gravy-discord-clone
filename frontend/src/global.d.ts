type ValueOf<T> = T[keyof T]
type TODO = any;

/**
 * Store related helper functions. 
 */
type TCustomStore<TStore extends Store<any, any>> = TStore extends import('@tanstack/react-store').Store<infer T> ? T : never  
type TUseSpecificStore<TStore, Extras = any> = <TSelected = NoInfer<TStore>>(selector?: (state: TStore) => TSelected) => TSelected & Extras;
type TUseSpecificStoreTuple<TStore, Rest extends unknown | undefined = undefined> = <TSelected = NoInfer<TStore>>(selector?: (state: TStore) => TSelected) => Rest extends undefined 
  ? [TSelected, (updater: (store: TStore) => TStore) => void]
  : [TSelected, Rest, (updater: (store: TStore) => TStore) => void]