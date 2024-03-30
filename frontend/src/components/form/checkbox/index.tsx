import { DeepKeys, FieldMeta, FormApi, UseField } from "@tanstack/react-form";
import classNames from "classnames";
import { Flex } from "../../utility/flex";
import { Text } from "../../utility/text";

import './_Checkbox.scss';
import { Checkmark } from "../../../assets/icons/check";
import { useTheme } from "../../../utilities/hooks/useTheme";
import { CSSProperties } from "react";
import { Validator } from "@tanstack/form-core";

export const generateCheckboxField = <TData extends Record<string, any>, TValidator extends Validator<TData> | undefined>(form: FormApi<TData, TValidator>) => {
  /***** TYPE DEFINITIONS *****/
  type TValidators = Parameters<UseField<TData, TValidator>>[0]['validators'];
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
              onChange={(e) => handleChange(e.target.checked as any)}
              onBlur={handleBlur}
              checked={!!state.value}
            />
            <button 
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleChange(!state.value as any)
              }} 
              type="button"
              style={style} 
              className={classes.checkbox}
            >
              {!!state.value && <Checkmark />}
            </button>
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