/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi } from "@tanstack/react-form";
import React, { InputHTMLAttributes, useState } from "react";
import classNames from "classnames";
import { FieldValidators, Validator } from "@tanstack/form-core";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";

/***** HOOKS *****/
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";

/***** SHARED *****/
import { FieldLabel } from "../general/label/label";
import { Text } from "../../utility/text";
import { Flex } from "../../utility/flex";

/***** CONSTS *****/
import './_Input.scss';

const isLeftRightLabel = z.object({
  left: z.any(),
  right: z.any()
})

/***** COMPONENT START *****/
export const generateInputField = <TData extends Record<string, any>, TValidator extends Validator<TData> | undefined>(form: FormApi<TData, TValidator>) => {
  /***** TYPE DEFINITIONS *****/
  type TInputFieldProps<TName extends DeepKeys<TData>> = {
    name: TName;

    /**
     * Label for the input field. This can be any react node, however, if an object is provided, the left key will be
     * displayed on the left side of the input field and the right key will be displayed on the right side of the input field.
     * 
     * This distinction is necessary to allow the required field and displayed errors to still be positioned relative to the left
     * side of the input field.
     */
    label?: React.ReactNode | {
      left?: React.ReactNode;
      right?: React.ReactNode;
    };

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
    const [isFocused, setIsFocused] = useState(false);

    /***** FUNCTIONS *****/
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

    /***** FORM *****/
    const { state, handleBlur, handleChange } = form.useField({
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validatorAdapter: zodValidator as any,
      validators: getValidators()
    })

    const { errors } = state.meta;

    /***** RENDER HELPERS *****/
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

    const parsedLabel = isLeftRightLabel.safeParse(label);

    /***** RENDER *****/
    return (
      <div className={classes.outer}>
        
        {parsedLabel.success && (
          <Flex justify="space-between">
            <FieldLabel render={!!parsedLabel.data.left || !!parsedLabel.data.right} errors={errors} name={name} className={classes.label} intrinsic={{ onClick: (e) => e.preventDefault() }}>
              {parsedLabel.data.left} {parsedLabel.data.left && required && <Text error span>*</Text>}
            </FieldLabel>
            {parsedLabel.data.right}
          </Flex>
        )}

        {parsedLabel.success && Object.keys(parsedLabel.data).length === 0 && (
          <FieldLabel render={!!label} errors={errors} name={name} className={classes.label} intrinsic={{ onClick: (e) => e.preventDefault() }}>
            {label as React.ReactNode} {label && required && <Text error span>*</Text>}
          </FieldLabel>
        )}

        <input
          ref={innerRef}
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
          {...intrinsic}
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