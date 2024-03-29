/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi, useField, UseField } from "@tanstack/react-form";
import React, { createContext, InputHTMLAttributes, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

/***** SHARED *****/
import { FieldLabel } from "../general/label";

/***** CONSTS *****/
import './_Select.scss';
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";
import { useToggleState } from "../../../utilities/hooks/useToggleState";
import { generateInputField } from "../input";
import { ChevronRight } from "../../../assets/icons/chevron-right";

type TSelectContext = {
  name: string;
  handleChange: (value: unknown) => void;
  value: any;
}

const SelectContext = createContext<TSelectContext>({
  name: '',
  handleChange: () => {},
  value: ''
});

const useSelectContext = (_value: unknown) => {  
  const { value, ...rest } =  useContext(SelectContext);

  return {
    ...rest,
    isSelected: value === _value
  }
};

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
  // type TData = T extends FormApi<infer _TData, any> ? _TData : never;
  // type TFormValidator = T extends FormApi<any, infer _TValidator> ? _TValidator : never;
  // type TValidators = Parameters<UseField<TData, TFormValidator>>[0]['validators'];
  // type TSelectField = React.FC<{
  //   name: DeepKeys<TData>;
  //   label?: React.ReactNode;
  //   defaultMeta?: Partial<FieldMeta>;
  //   asyncDebounceMs?: number;
  //   validators?: TValidators;
  //   className?: string;
  //   intrinsic?: InputHTMLAttributes<HTMLSelectElement>;
  //   children: React.ReactNode;
  // }>

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
    const { handleChange, isSelected } = useSelectContext(value);
    
    const classes = classNames("SelectField__option", {
      "SelectField__option--selected": isSelected 
    })

    return (
      <button className={classes} onClick={() => handleChange(value)}>
        {children}
      </button>
    );
  }

  /***** COMPONENT START *****/
  const SelectField: TSelectField = ({ asyncDebounceMs, defaultMeta, validators, name, className, intrinsic, label, children }) => {
    const isUsingKeyboard = useUsingKeyboard();
    const [isOpen, toggleIsOpen] = useToggleState()

    const { state, handleBlur, handleChange } = useField({
      form,
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validators
    });
    const { errors } = state.meta;

    const InputField = generateInputField(form)


    return (
      <SelectContext.Provider value={{ name, handleChange, value: state.value }}>
        <div className={classNames("SelectField", className)}>
          <FieldLabel errors={errors} className={className} name={name}>
            {label}
          </FieldLabel>

          {/* Native element for accessibility */}
          {/* <select 
            value={state.value}
            onBlur={handleBlur}
            onChange={(e) => handleChange(e.target.value as any)} 
            className={classNames("SelectField__nativeSelect", {
              "SelectField__nativeSelect--using-keyboard": isUsingKeyboard
            })}
            {...intrinsic}
          >
            {children}
          </select> */}

          {/* Rendered Content */}
          <div className="SelectField__select">
            <InputField
              className="SelectField__input"
              name={`${name}--search` as any}
              intrinsic={{
                onClick: () => toggleIsOpen(),
                onKeyDown: (e) => e.key === 'Enter' && toggleIsOpen(),
                autoComplete: "off"
              }}
            />
            <div className={classNames("SelectField__chevron", {
              "SelectField__chevron--open": isOpen,
            })}>
              <ChevronRight height={16} />
            </div>
          </div>
          <div style={{ display: isOpen ? 'none' : undefined }}>
            {children}
          </div>
        </div>
      </SelectContext.Provider>
    );
  }

  return Object.assign(SelectField, { Option });
}
