/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi, UseField, useField } from "@tanstack/react-form";
import { InputHTMLAttributes } from "react";
import classNames from "classnames";


/***** HOOKS *****/
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";

/***** CONSTS *****/
import './_Input.scss';
import { Text } from "../../utility/text";

/***** COMPONENT START *****/
// export const generateInputField = <TData extends any extends FormApi<infer _TData, infer _TValidator> ? _TData : never>(form: FormApi<TData>) => {
export const generateInputField = <T extends FormApi<any, any>>(form: T) => {
  type TData = T extends FormApi<infer _TData, any> ? _TData : never;
  type TFormValidator = T extends FormApi<any, infer _TValidator> ? _TValidator : never;
  type TValidators = Parameters<UseField<TData, TFormValidator>>[0]['validators']

  /***** TYPE DEFINITIONS *****/
  type TInputField = React.FC<{
    name: DeepKeys<TData>;
    label?: React.ReactNode;
    placeholder?: string;
    defaultMeta?: Partial<FieldMeta>;
    asyncDebounceMs?: number;
    validators?: TValidators;
    required?: boolean;
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
        {!!label && (
          <label className="InputField__label" htmlFor={name}>
            <Text span secondary={!errors.length} error={!!errors.length} >
              {label} <Text italic span sm>{!!errors.length && `- ${errors[0]}`}</Text>
            </Text>
          </label>
        )}
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
