/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi, UseField } from "@tanstack/react-form";
import React, { InputHTMLAttributes } from "react";
import classNames from "classnames";
import { FormValidators, Validator } from "@tanstack/form-core";

/***** HOOKS *****/
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";

/***** SHARED *****/
import { FieldLabel } from "../general/label/label";

/***** CONSTS *****/
import './_Input.scss';
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Text } from "../../utility/text";

/***** COMPONENT START *****/
export const generateInputField = <TData extends Record<string, any>, TValidator extends Validator<TData> | undefined>(form: FormApi<TData, TValidator>) => {
  /***** TYPE DEFINITIONS *****/
  type TInputField = React.FC<{
    name: DeepKeys<TData>;
    label?: React.ReactNode;
    placeholder?: string;
    defaultMeta?: Partial<FieldMeta>;
    asyncDebounceMs?: number;
    validators?: FormValidators<TData, TValidator>;
    className?: string;
    intrinsic?: InputHTMLAttributes<HTMLInputElement>,
    innerRef?: React.RefObject<HTMLInputElement>;
    required?: boolean;
  }>

  /**
   * InputField
   * 
   * Does not currently support field level validation due to type issues
   */
  const InputField: TInputField = ({ name, required, label, placeholder, defaultMeta, asyncDebounceMs, className, validators, innerRef, intrinsic = {} }) => {
    /***** HOOKS *****/
    const isUsingKeyboard = useUsingKeyboard();

    const getValidators = () => {
      const requiredValidator = z.string().min(1, 'A value must be provided');
      if (!required)
        return validators;

      if (!validators?.onChange)
        return { onChange: requiredValidator };

      return {
        ...validators,
        onChange: z.intersection(validators.onChange as any, requiredValidator)
      }
    }

    const { state, handleBlur, handleChange } = form.useField({
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validatorAdapter: zodValidator as any,
      validators: getValidators()
    })

    const { errors } = state.meta;

    /***** RENDER *****/
    return (
      <div className={classNames("InputField", className)}>
        <FieldLabel render={!!label} errors={errors} name={name} className="InputField__label">
          {label} {label && required && <Text error span>*</Text>}
        </FieldLabel>
        <input
          ref={innerRef}
          {...intrinsic}
          type="text"
          placeholder={placeholder}
          value={state.value ?? ''}
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