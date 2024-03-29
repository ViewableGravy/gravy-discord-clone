/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi, useField, UseField } from "@tanstack/react-form";
import React, { createContext, CSSProperties, InputHTMLAttributes, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

/***** SHARED *****/
import { FieldLabel } from "../general/label/label";

/***** CONSTS *****/
import './_Select.scss';
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";
import { useToggleState } from "../../../utilities/hooks/useToggleState";
import { generateInputField } from "../input";
import { ChevronRight } from "../../../assets/icons/chevron-right";
import { useClickAway } from "../../../utilities/hooks/useClickAway";

type TSelectContext = {
  name: string;
  form: FormApi<any, any>;
  handleChange: (value: unknown) => void;
  value: any;
  isSearching: boolean;
}

const SelectContext = createContext<TSelectContext>({
  name: '',
  handleChange: () => {},
  value: '',
  form: {} as any,
  isSearching: false
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
  //   children: React.ReactNode;
  // }>

  type TOption = React.FC<{
    /**
     * will need to update as value does not necessarily have to be a value, it
     * should probably just be anything for now
     */
    value: any; 
    children: string;
  }>

  /***** COMPONENT START *****/
  const Option: TOption = ({ children, value }) => {
    /***** HOOKS *****/
    const { handleChange, isSelected, form, name, isSearching } = useSelectContext(value);
    const { state } = useField({ form, name: `${name}--search` })
    
    /***** RENDER HELPERS *****/
    const matchesSearch = state.value?.toLowerCase().includes(children.toLowerCase());
    const classes = classNames("SelectField__option", {
      "SelectField__option--selected": isSelected 
    })
    
    /***** RENDER *****/
    return (
      <>
        {isSearching && !matchesSearch ? null : (
          <button className={classes} onClick={() => handleChange(value)}>
            {children}
          </button>
        )}
      </>
    );
  }

  /***** COMPONENT START *****/
  const SelectField: TSelectField = ({ asyncDebounceMs, defaultMeta, validators, name, className, label, children }) => {
    const [isOpen, toggleIsOpen] = useToggleState()
    const [isSearching, toggleIsSearching] = useToggleState()
    const clickawayRef = useClickAway<HTMLDivElement>((e) => {
      toggleIsOpen(false)
      toggleIsSearching(false)
    });

    const { state, handleBlur, handleChange } = useField({
      form,
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validators
    });

    const { errors } = state.meta;

    const InputField = useMemo(() => generateInputField(form), [form])

    const dropdownStyle = {
      '--display-dropdown': isOpen ? 'block' : 'none'
    } as CSSProperties

    const context = {
      name,
      form,
      handleChange,
      value: state.value,
      isSearching
    }

    return (
      <SelectContext.Provider value={context}>
        <div className={classNames("SelectField", className)}>
          <FieldLabel errors={errors} className={className} name={name}>
            {label}
          </FieldLabel>
          <div ref={clickawayRef} className="SelectField__select">
            <InputField
              className="SelectField__input"
              name={`${name}--search` as any}
              intrinsic={{
                onClick: () => {
                  toggleIsOpen();
                  toggleIsSearching(false);
                },
                onKeyDown: (e) => {
                  switch(e.key) {
                    case 'Tab': {
                      return toggleIsSearching(false);
                    }
                    case 'Enter': {
                      toggleIsOpen();
                      toggleIsSearching(false);
                      break;
                    }
                    default: {
                      return toggleIsSearching(true);
                    }
                  }
                },
                autoComplete: "off"
              }}
            />
            <div className={classNames("SelectField__chevron", {
              "SelectField__chevron--open": isOpen,
            })}>
              <ChevronRight height={16} />
            </div>
          </div>
          <div className="SelectField__dropdown" style={dropdownStyle}>
            {children}
          </div>
        </div>
      </SelectContext.Provider>
    );
  }

  return Object.assign(SelectField, { Option });
}
