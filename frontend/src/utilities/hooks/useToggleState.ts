import { useState } from "react";

/**
 * If Condition is true, then this will return a valid key of an objects, 
 * otherwise it will fallback to the Fallback arg which defaults to any
 */
export type ObjectKey<Condition extends boolean, Fallback = any> = Condition extends true ? string | number | Symbol : Fallback;

/**
 * Converts a union to an intersection. Note that this is primarily helpful when creating complex types (T extends X) because
 * a complex type will "iterate" over unions and return the relevant return type for each union.
 * 
 * This means that if you have a union and then return an object for examples ({ [key in T]: boolean }) then the return type will
 * be a union with as many options as the union provided as a generic. Wrapper said function in this will recombine them into a single
 * object. (intersection vs union)
 */
export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends ((x: infer I)=>void) ? I : never

export type _ToggleableState<Value, State> = [
  value: Value,
  toggle: (state?: State) => void
]

export type TReturnType<
  T extends ObjectKey<G> | undefined = undefined,
  G extends boolean = false
> = 
  T extends undefined 
    ? _ToggleableState<boolean, boolean>
    : G extends true 
      ? [
          { [key in NonNullable<T>]: boolean; }, 
          toggle: (state?: T) => void
        ] 
      : _ToggleableState<T, T>

export type TToggleState = <
  const T extends ObjectKey<G> | undefined = undefined, 
  G extends boolean = false
>(
  states?: T[], 
  options?: {
    initialValue?: NoInfer<T>,
    objectValues?: G,
    onChange?: (state: T) => void
  }
) => G extends true ? UnionToIntersection<TReturnType<T, true>> : TReturnType<T, false>

/**
 * The useToggleState2 hook is a more advanced version of the useToggleState hook.
 * This acts more as a useIncrement hook when it is provided with an array of values as it will
 * cycle through the array of values when the second value from the return type is called.
 * 
 * When no value is provided, this acts as a boolean toggle.
 */
export const useToggleState: TToggleState = (states, options) => {
    const { initialValue, objectValues, onChange } = {
        initialValue: states?.[0] ?? false,
        objectValues: false,
        ...options
    }
    const _states = states ?? [true, false] as const;

    const [state, setState] = useState(initialValue);

    type TStates = typeof states;
    const toggle = (state?: TStates extends Array<any> ? TStates[number] : boolean) => setState((_state) => {
        if ((state || state === false)  && _states.includes(state as any)) {
          onChange?.(state as any);
          return state;
        }

        const index = _states.indexOf(_state as any);
        const newState = _states[index + 1] ?? _states[0];

        onChange?.(newState as any);
        return newState;
    });

    if (objectValues) {
        const _state = _states.reduce((acc, _state) => ({ ...acc, [_state as any]: _state === state }), {} as any);

        return [_state, toggle] as any;
    }

    return [state, toggle] as any;
}