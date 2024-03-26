/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi, UseField, useField } from "@tanstack/react-form";
import React, { InputHTMLAttributes } from "react";
import classNames from "classnames";

/***** HOOKS *****/
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";

/***** UTILITIES *****/
import { Text } from "../../utility/text";

/***** CONSTS *****/
import './_Input.scss';
import { FieldLabel } from "../general/label";

/***** COMPONENT START *****/
export const generateInputField = <T extends FormApi<any, any>>(form: T) => {
  /***** TYPE DEFINITIONS *****/
  type TData = T extends FormApi<infer _TData, any> ? _TData : never;
  type TFormValidator = T extends FormApi<any, infer _TValidator> ? _TValidator : never;
  type TValidators = Parameters<UseField<TData, TFormValidator>>[0]['validators']
  type TInputField = React.FC<{
    name: DeepKeys<TData>;
    label?: React.ReactNode;
    placeholder?: string;
    defaultMeta?: Partial<FieldMeta>;
    asyncDebounceMs?: number;
    validators?: TValidators;
    className?: string;
    intrinsic?: InputHTMLAttributes<HTMLInputElement>
  }>

  /**
   * InputField
   * 
   * Does not currently support field level validation due to type issues
   */
  const InputField: TInputField = ({ name, label, placeholder, defaultMeta, asyncDebounceMs, className, validators, intrinsic = {} }) => {
    /***** HOOKS *****/
    const isUsingKeyboard = useUsingKeyboard();
    const { state, handleBlur, handleChange } = useField({
      form,
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validators
    })

    const { errors } = state.meta;

    /***** RENDER *****/
    return (
      <div className={classNames("InputField", className)}>
        <FieldLabel errors={errors} name={name} className="InputField__label">
          {label}
        </FieldLabel>
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