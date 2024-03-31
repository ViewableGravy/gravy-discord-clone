/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi } from "@tanstack/react-form";
import React, { InputHTMLAttributes } from "react";
import classNames from "classnames";
import { FieldValidators, Validator } from "@tanstack/form-core";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";

/***** HOOKS *****/
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";

/***** SHARED *****/
import { FieldLabel } from "../general/label/label";
import { Text } from "../../utility/text";

/***** CONSTS *****/
import './_Input.scss';

/***** COMPONENT START *****/
export const generateInputField = <TData extends Record<string, any>, TValidator extends Validator<TData> | undefined>(form: FormApi<TData, TValidator>) => {
  /***** TYPE DEFINITIONS *****/
  type TInputFieldProps<TName extends DeepKeys<TData>> = {
    name: TName;
    label?: React.ReactNode;
    placeholder?: string;
    defaultMeta?: Partial<FieldMeta>;
    asyncDebounceMs?: number;
    className?: string;

    /**
     * Allows for providing field level validators. The TName type currently gives a type error however
     * I believe it meets the requirements of the FieldValidators type (and as a result, returns the correct)
     * type for the validators based on the field name.
     */
    validators?: FieldValidators<
      TData, 
      //@ts-ignore
      TName, 
      TValidator, 
      TValidator
    >;

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

    /**
     * A message that should be displayed to the user when the field is selected. This is particularly useful for
     * providing additional context to the user. Note, this message is in the same position as the manual error which
     * means it cannot be shown at the same time as the manual error.
     */
    selectedMessage?: React.ReactNode;
  }

  /**
   * InputField
   * 
   * Does not currently support field level validation due to type issues
   */
  const InputField = <TName extends DeepKeys<TData>>({ 
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
    selectedMessage,
    intrinsic = {} 
  }: TInputFieldProps<TName>) => {
    /***** HOOKS *****/
    const isUsingKeyboard = useUsingKeyboard();
    
    /***** STATE *****/
    const [isFocused, setIsFocused] = React.useState(false);

    const getValidators = () => {
      const requiredValidator = z.string().min(1, 'Required');
      if (!required)
        return validators;

      if (!validators?.onChange)
        return { onChange: requiredValidator };

      return {
        ...validators,
        onChange: z.intersection(requiredValidator, validators.onChange as any)
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

    const classes = {
      outer: classNames("InputField", className),
      label: "InputField__label",
      input: classNames("InputField__input", {
        "InputField__input--using-keyboard": isUsingKeyboard
      }),
      manualWrapper: classNames("InputField__manualWrapper", { 
        "InputField__manualWrapper--open": (selectedMessage && isFocused) || manualError
      })
    }

    /***** RENDER *****/
    return (
      <div className={classes.outer}>
        <FieldLabel render={!!label} errors={errors} name={name} className={classes.label} intrinsic={{ onClick: (e) => e.preventDefault() }}>
          {label} {label && required && <Text error span>*</Text>}
        </FieldLabel>
        <input
          ref={innerRef}
          {...intrinsic}
          type="text"
          placeholder={placeholder}
          value={state.value ?? ''}
          onBlur={() => {
            handleBlur();
            setIsFocused(false);
          }}
          onChange={(e) => handleChange(e.target.value as any)}
          name={name}
          onFocus={() => setIsFocused(true)}
          id={name}
          className={classes.input}
        />
        <div className={classes.manualWrapper}>
          {!!manualError && <Text error md>{manualError}</Text>}
          {!!selectedMessage && isFocused && !manualError && <Text md primary>{selectedMessage}</Text>}
        </div>
      </div>
    )
  };

  return InputField;
}