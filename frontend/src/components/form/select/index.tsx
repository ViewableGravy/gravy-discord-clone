/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi, useField, UseField } from "@tanstack/react-form";
import React, { InputHTMLAttributes, useContext } from "react";
import classNames from "classnames";

/***** SHARED *****/
import { FieldLabel } from "../general/label";

/***** CONSTS *****/
import './_Select.scss';
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";

const SelectContext = React.createContext({
  name: ''
})
const useSelectContext = () => {
  return useContext(SelectContext)
}

/**
 * SelectField Implementation overview:
 * 
 * @example 
 * ```
  <SelectField name="day" label="days">
    <SelectField.Option value="monday">Monday</SelectField.Option>
    <SelectField.Option value="tuesday">Tuesday</SelectField.Option>
    <SelectField.Option value="wednesday">Wednesday</SelectField.Option>
    <SelectField.Option value="thursday">Thursday</SelectField.Option>
    <SelectField.Option value="friday">Friday</SelectField.Option>
    <SelectField.Option value="saturday">Saturday</SelectField.Option>
    <SelectField.Option value="sunday">Sunday</SelectField.Option>
  </SelectField>
 ```
 */
export const generateSelectField = <T extends FormApi<any, any>>(form: T) => {
  /***** TYPE DEFINITIONS *****/
  type TData = T extends FormApi<infer _TData, any> ? _TData : never;
  type TFormValidator = T extends FormApi<any, infer _TValidator> ? _TValidator : never;
  type TValidators = Parameters<UseField<TData, TFormValidator>>[0]['validators'];
  type TSelectField = React.FC<{
    name: DeepKeys<TData>;
    label?: React.ReactNode;
    defaultMeta?: Partial<FieldMeta>;
    asyncDebounceMs?: number;
    validators?: TValidators;
    className?: string;
    intrinsic?: InputHTMLAttributes<HTMLSelectElement>;
    children: React.ReactNode;
  }>

  type TOption = React.FC<{
    /**
     * will need to update as value does not necessarily have to be a value, it
     * should probably just be anything for now
     */
    value: any; 
    children: React.ReactNode
  }>

  /***** COMPONENT START *****/
  const Option: TOption = ({ children, value }) => {
    return (
      <option value={value}>
        {children}
      </option>
    )
  }

  /***** COMPONENT START *****/
  const SelectField: TSelectField = ({ asyncDebounceMs, defaultMeta, validators, name, className, intrinsic, label, children }) => {
    const isUsingKeyboard = useUsingKeyboard();

    const { state, handleBlur, handleChange } = useField({
      form,
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validators
    })

    const { errors } = state.meta;

    return (
      <SelectContext.Provider value={{ name }}>
        <div className={classNames("SelectField", className)}>
          <FieldLabel errors={errors} className={className} name={name}>
            {label}
          </FieldLabel>
          <select 
            value={state.value}
            onBlur={handleBlur}
            onChange={(e) => handleChange(e.target.value as any)} 
            className={classNames("SelectField__select", {
              "SelectField__select--using-keyboard": isUsingKeyboard
            })}
            {...intrinsic}
          >
            {children}
          </select>
        </div>
      </SelectContext.Provider>
    );
  }

  return Object.assign(SelectField, { Option });
}
