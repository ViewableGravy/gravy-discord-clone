/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi, useField } from "@tanstack/react-form";
import { zodValidator } from '@tanstack/zod-form-adapter'
import { InputHTMLAttributes } from "react";
import classNames from "classnames";

/***** HOOKS *****/
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";

/***** CONSTS *****/
import './_Input.scss';

/***** COMPONENT START *****/
export const generateInputField = <TData extends any extends FormApi<infer _TData, any> ? _TData : never>(form: FormApi<TData>) => {
  /***** TYPE DEFINITIONS *****/
  type TInputField = React.FC<InputHTMLAttributes<HTMLInputElement> & {
    name: DeepKeys<TData>;
    label?: React.ReactNode;
    placeholder?: string;
    defaultMeta?: Partial<FieldMeta>;
    asyncDebounceMs?: number;
  }>

  /**
   * InputField
   * 
   * Does not currently support field level validation due to type issues
   */
  const InputField: TInputField = ({ name, label, placeholder, defaultMeta, asyncDebounceMs, className, ...intrinsic }) => {
    /***** HOOKS *****/
    const isUsingKeyboard = useUsingKeyboard();
    const { state, handleBlur, handleChange } = useField({
      form,
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validatorAdapter: zodValidator
    })

    /***** RENDER *****/
    return (
      <div className={classNames("InputField", className)}>
        {!!label && <label className="InputField__label" htmlFor={name}>{label}</label>}
        <input
          {...intrinsic}
          type="text"
          placeholder={placeholder}
          value={state.value}
          onBlur={handleBlur}
          onChange={(e) => handleChange(e.target.value as any)}
          name={name}
          id={name}
          className={classNames("InputField__input", {
            "InputField__input--using-keyboard": isUsingKeyboard
          })}
        />
      </div>
    )
  };

  return InputField;
}
