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
import { Padding } from "../../utility/padding";

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

    /**
     * Allows for providing intrinsic input attributes. This helps isolate native input attributes from the
     * component's props.
     */
    intrinsic?: InputHTMLAttributes<HTMLInputElement>;

    /**
     * Allows for providing a reference to the input field. This is particularly useful for focusing the field
     * after a certain action.
     */
    innerRef?: React.RefObject<HTMLInputElement>;

    /**
     * Determines if the field is required. If true, the field will be validated with a minimum length of 1 as well as
     * any additional validators provided.
     */
    required?: boolean;

    /**
     * Allows for providing a manual error to the field. This is particularly useful for providing an error
     * as a result of an API response. It is also in lieu of the feature not being supported in tanstack form yet.
     */
    manualError?: string | boolean;
  }>

  /**
   * InputField
   * 
   * Does not currently support field level validation due to type issues
   */
  const InputField: TInputField = ({ 
    name, 
    required, 
    label, 
    placeholder, 
    defaultMeta, 
    asyncDebounceMs, 
    className, 
    validators, 
    innerRef, 
    manualError, 
    intrinsic = {} 
  }) => {
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
        {manualError && (
          <Padding margin top="extra-small">
            <Text error sm>{manualError}</Text>
          </Padding>
        )}
      </div>
    )
  };

  return InputField;
}