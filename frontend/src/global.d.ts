type ValueOf<T> = T[keyof T]
type TODO = any;

/**
 * Store related helper functions. 
 */
type TCustomStore<TStore extends Store<any, any>> = TStore extends import('@tanstack/react-store').Store<infer T> ? T : never  
type TUseSpecificStore<TStore, Extras = unknown> = <TSelected = NoInfer<TStore>>(selector?: (state: TStore) => TSelected) => TSelected & Extras;
type TUseSpecificStoreTuple<TStore, Extras = unknown> = <TSelected = NoInfer<TStore>>(selector?: (state: TStore) => TSelected) => [TSelected & Extras, (updater: (store: TStore) => TStore) => void];