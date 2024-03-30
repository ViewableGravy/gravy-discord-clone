import { DeepKeys, FieldMeta, FormApi, UseField } from "@tanstack/react-form";
import classNames from "classnames";
import { Flex } from "../../utility/flex";
import { Text } from "../../utility/text";

import './_Checkbox.scss';
import { Checkmark } from "../../../assets/icons/check";
import { useTheme } from "../../../utilities/hooks/useTheme";
import { CSSProperties } from "react";

export const generateCheckboxField = <T extends FormApi<any, any>>(form: T) => {
  /***** TYPE DEFINITIONS *****/
  type TData = T extends FormApi<infer _TData, any> ? _TData : never;
  type TFormValidator = T extends FormApi<any, infer _TValidator> ? _TValidator : never;
  type TValidators = Parameters<UseField<TData, TFormValidator>>[0]['validators'];
  type TCheckboxField = React.FC<{
    name: DeepKeys<TData>;
    label?: React.ReactNode;
    defaultMeta?: Partial<FieldMeta>;
    asyncDebounceMs?: number;
    validators?: TValidators;
    className?: string;
    children: React.ReactNode;
    direction?: 'up' | 'down';
    placeholder?: string;
  }>

  /***** COMPONENT START *****/
  const CheckboxField: TCheckboxField = ({ 
    asyncDebounceMs, 
    defaultMeta, 
    validators, 
    name, 
    className,
    children,
  }) => {
    const [{ backgroundColor, color }, { opacity }] = useTheme((theme) => theme)
    const { handleChange, state, handleBlur } = form.useField({
      name,
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validators
    });

    const style = {
      '--background-color': backgroundColor.button,
      '--border-color': opacity(color.tertiary, state.value && 0.5)
    } as CSSProperties

    const classes = {
      outer: classNames("CheckboxField", className),
      checkbox: classNames("CheckboxField__checkbox", {
        "CheckboxField__checkbox--selected": state.value
      }),
      native: "CheckboxField__nativeCheckbox"
    }

    return (
      <div className={classes.outer}>
        <label>
          <Flex gap={8} align="center" justify="space-between">
            <input 
              type="checkbox" 
              className={classes.native} 
              onChange={(e) => handleChange(e.target.checked)}
              onBlur={handleBlur}
            />
            <span style={style} className={classes.checkbox}>
              {!!state.value && <Checkmark />}
            </span>
            <Text sm tertiary no-select>
              {children}
            </Text>
          </Flex>
        </label>
      </div>
    )
  }

  return CheckboxField;
}