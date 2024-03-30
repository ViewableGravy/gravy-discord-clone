/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi, UseField } from "@tanstack/react-form";
import React, { createContext, CSSProperties, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

/***** SHARED *****/
import { FieldLabel } from "../general/label/label";
import { Text } from "../../utility/text";

/***** UTILITIES *****/
import { useToggleState } from "../../../utilities/hooks/useToggleState";
import { useClickAway } from "../../../utilities/hooks/useClickAway";
import { useTheme } from "../../../utilities/hooks/useTheme";
import { useOptionFieldKeyboardState, useSelectFieldKeyboardState as useSelectFieldKeyboardEffect } from "./useKeyboardEvents";
import { generateInputField } from "../input";

/***** CONSTS *****/
import './_Select.scss';
import { ChevronRight } from "../../../assets/icons/chevron-right";
import { Validator } from "@tanstack/form-core";

type TSelectContext = {
  name: string;
  form: FormApi<any, any>;
  value: any;
  isSearching: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleIsSearching: (state?: boolean | undefined) => void;
  registerNameValueMapping: (mapping: Record<string, string | number>) => void;
  unregisterNameValueMapping: (value: string) => void;
  toggleIsOpen: (state?: boolean | undefined) => void;
}

const SelectContext = createContext<TSelectContext>({
  name: '',
  value: '',
  form: {} as any,
  isSearching: false,
  toggleIsSearching: () => {},
  registerNameValueMapping: () => {},
  unregisterNameValueMapping: () => {},
  toggleIsOpen: () => {},
  inputRef: {} as any
});

export const useSelectContext = (_value?: unknown) => {  
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
export const generateSelectField =  <TData extends Record<string, any>, TValidator extends Validator<TData> | undefined>(form: FormApi<TData, TValidator>) => {
  /***** TYPE DEFINITIONS *****/
  type TValidators = Parameters<UseField<TData, TValidator>>[0]['validators'];
  type TSelectField = React.FC<{
    name: DeepKeys<TData>;
    label?: React.ReactNode;
    defaultMeta?: Partial<FieldMeta>;
    asyncDebounceMs?: number;

    /**
     * Although this is typed correctly and will be passed through, there are currently issues with this implementation
     * due to the field implementation. I'll likely want to reconsider the implementation to use a controlled input field
     * for searching and displaying rather than a single input field.
     */
    validators?: TValidators;
    className?: string;
    children: React.ReactNode;
    direction?: 'up' | 'down';
    placeholder?: string;
  }>

  type TOption = React.FC<{
    /**
     * This is the value that will be used to update the form value. It can be anything that would want to be submitted
     */
    value: any; 

    /**
     * This is the value that will be displayed to the user
     */
    children: string | number;
  }>

  /***** COMPONENT START *****/
  const Option: TOption = ({ children, value }) => {
    /***** HOOKS *****/
    const { 
      isSelected, 
      form, 
      name, 
      isSearching, 
      toggleIsSearching, 
      toggleIsOpen,
      registerNameValueMapping, 
      unregisterNameValueMapping 
    } = useSelectContext(value);
    const [{ primary, form: themedForm }] = useTheme(({ backgroundColor }) => backgroundColor); 
    const { state, handleChange: handleValueChange } = form.useField({ name });
    const { state: humanState, handleChange: handleHumanChange } = form.useField({ name: `${name}--human`, defaultValue: state.value ?? '' });
    const { state: searchState, handleChange: handleSearchChange } = form.useField({ name: `${name}--search`, defaultValue: state.value ?? humanState.value ?? '' })
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      registerNameValueMapping({ [value]: children })

      return () => {
        unregisterNameValueMapping(value)
      }
    }, [value, children])

    useOptionFieldKeyboardState({ buttonRef })

    /***** RENDER HELPERS *****/
    const matchesSearch = !searchState.value ? true : String(children).toLowerCase().includes(searchState?.value?.toLowerCase?.());
    const classes = classNames("SelectField__option", {
      "SelectField__option--selected": isSelected 
    })
    const styles = {
      '--background-color': primary,
      '--background-color-hover': themedForm.select.hover,
      '--background-color-selected': themedForm.select.selected,
    } as CSSProperties;

    /***** RENDER *****/
    return (
      <>
        {isSearching && !matchesSearch ? null : (
          <button 
            type="button"
            ref={buttonRef}
            style={styles}
            className={classes}
            onClick={() => {
              handleValueChange(value)
              handleHumanChange(children)
              toggleIsSearching(false)
              toggleIsOpen(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                toggleIsSearching(false)
                toggleIsOpen(false)
              }
              if (e.key === 'Enter') {
                handleValueChange(value)
                handleSearchChange(children)
                handleHumanChange(children)
                toggleIsSearching(false)
                toggleIsOpen(false)
              }
            }}
          >
            <Text align-left lg>
              {children}
            </Text>
          </button>
        )}
      </>
    );
  }

  /***** COMPONENT START *****/
  const SelectField: TSelectField = ({ 
    asyncDebounceMs, 
    defaultMeta, 
    validators, 
    name, 
    className, 
    label, 
    children, 
    direction, 
    placeholder 
  }) => {
    /***** HOOKS *****/
    const InputField = useMemo(() => generateInputField(form), [form])
    const clickawayRef = useClickAway<HTMLDivElement>(() => {
      toggleIsOpen(false)
      toggleIsSearching(false)
    });
    const { state, handleChange } = form.useField({
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validators
    });

    /***** STATE *****/
    const [isOpen, toggleIsOpen] = useToggleState()
    const [isSearching, toggleIsSearching] = useToggleState()
    const inputRef = useRef<HTMLInputElement>(null)
    const [nameValueMapping, setNameValueMapping] = React.useState<Record<string, string | number>>({})

    /***** FUNCTIONS *****/
    const registerNameValueMapping = (mapping: Record<string, string | number>) => {
      setNameValueMapping((prev) => ({ ...prev, ...mapping }))
    }

    const unregisterNameValueMapping = (value: string) => {
      setNameValueMapping((prev) => {
        const { [value]: _, ...rest } = prev
        return rest
      })
    }

    /***** EFFECTS *****/
    useSelectFieldKeyboardEffect({
      inputRef,
      clickawayRef,
      isSearching,
      toggleIsSearching,
      toggleIsOpen
    })

    /***** RENDER HELPERS *****/
    const { errors } = state.meta;
    const dropdownStyle = {
      '--display-dropdown': isOpen ? 'block' : 'none'
    } as CSSProperties;
    const classes = {
      outer: classNames("SelectField", className),
      inputWrapper: "SelectField__select",
      input: "SelectField__input",
      chevron: classNames("SelectField__chevron", {
        "SelectField__chevron--open": isOpen,
      }),
      dropdown: classNames("SelectField__dropdown", {
        "SelectField__dropdown--up": direction === "up" || !direction,
        "SelectField__dropdown--down": direction === "down",
        "SelectField__dropdown--hasLabel": label
      })
    }
    const inputName = isSearching ? `${name}--search` as any : `${name}--human`;
    const context = {
      name,
      form,
      handleChange,
      value: state.value,
      isSearching,
      toggleIsSearching,
      registerNameValueMapping,
      unregisterNameValueMapping,
      toggleIsOpen,
      inputRef
    };

    /***** RENDER *****/
    return (
      <SelectContext.Provider value={context}>
        <div ref={clickawayRef} className={classes.outer}>
          <FieldLabel errors={errors} name={name}>
            {label}
          </FieldLabel>
          <div className={classes.inputWrapper}>
            <InputField
              placeholder={placeholder}
              key={inputName}
              name={inputName}
              innerRef={inputRef}
              className={classes.input}
              intrinsic={{
                onClick() {
                  toggleIsOpen();

                  if (!isOpen) {
                    toggleIsSearching(false);
                  } else {
                    toggleIsSearching(true);
                  }
                },
                onKeyDown(e) {
                  switch(e.key) {
                    case 'Escape': {
                      e.stopPropagation();
                      toggleIsSearching(false);
                      return toggleIsOpen(false);
                    }
                    case 'Enter': {
                      e.stopPropagation();
                      if (isSearching) {
                        handleChange(e.currentTarget.value as any);
                      }
                      toggleIsOpen();
                      toggleIsSearching(isOpen);
                      return void setTimeout(() => {
                        inputRef.current?.focus(); 
                      });
                    }
                    case 'ArrowUp':
                    case 'ArrowDown': {
                      e.stopPropagation();
                      toggleIsOpen(true);
                      return void setTimeout(() => {
                        const firstOption = clickawayRef.current?.querySelector('.SelectField__option');
                        if (firstOption instanceof HTMLElement) {
                          firstOption.focus();
                        }
                      });
                    }
                    case 'Tab':
                    case 'Shift': 
                      return;
                    default: {
                      if (!isOpen) {
                        toggleIsOpen(true);
                      }
                      if (!isSearching) {
                        toggleIsSearching(true);
                      }
                    }
                  }
                },
                autoFocus: isSearching || isOpen,
                autoComplete: "off"
              }}
            />
            <div className={classes.chevron}>
              <ChevronRight height={16} />
            </div>
          </div>
          <div className={classes.dropdown} style={dropdownStyle}>
            {children}
          </div>
        </div>
      </SelectContext.Provider>
    );
  }

  return Object.assign(SelectField, { Option });
}
