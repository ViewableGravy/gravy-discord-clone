/***** BASE IMPORTS *****/
import { FormApi } from "@tanstack/react-form";
import React, { createContext, CSSProperties, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

/***** SHARED *****/
import { FieldLabel } from "../general/label/label";
import { Text } from "../../utility/text";

/***** UTILITIES *****/
import { useToggleState } from "../../../utilities/hooks/useToggleState";
import { useClickAway } from "../../../utilities/hooks/useClickAway";
import { useTheme } from "../../../utilities/hooks/useTheme";
import { useOptionFieldKeyboardState, useSelectFieldKeyboardState } from "./useKeyboardEvents";
import { generateInputField } from "../input";

/***** CONSTS *****/
import './_Select.scss';
import { ChevronRight } from "../../../assets/icons/chevron-right";

type TSelectContext = {
  name: string;
  form: FormApi<any, any>;
  value: any;
  isSearching: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleIsSearching: (state?: boolean | undefined) => void;
  registerNameValueMapping: (mapping: Record<string, string>) => void;
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
    const { state: searchState } = form.useField({ name: `${name}--search` })
    const { handleChange: handleHumanChange } = form.useField({ name: `${name}--human` });
    const { handleChange: handleValueChange } = form.useField({ name });
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      registerNameValueMapping({ [value]: children })

      return () => {
        unregisterNameValueMapping(value)
      }
    }, [value, children])

    useOptionFieldKeyboardState({ buttonRef })

    /***** RENDER HELPERS *****/
    const matchesSearch = !searchState.value ? true : String(children).toLowerCase().includes(searchState.value?.toLowerCase());
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
            ref={buttonRef}
            style={styles}
            className={classes}
            onClick={() => {
              toggleIsSearching(false)
              toggleIsOpen(false)
              handleValueChange(value)
              handleHumanChange(children)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                toggleIsSearching(false)
                toggleIsOpen(false)
              }
              if (e.key === 'Enter') {
                toggleIsSearching(false)
                toggleIsOpen(false)
                handleValueChange(value)
                handleHumanChange(children)
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
  const SelectField: TSelectField = ({ asyncDebounceMs, defaultMeta, validators, name, className, label, children, direction }) => {
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
    const [nameValueMapping, setNameValueMapping] = React.useState<Record<string, string>>({})

    /***** FUNCTIONS *****/
    const registerNameValueMapping = (mapping: Record<string, string>) => {
      setNameValueMapping((prev) => ({ ...prev, ...mapping }))
    }

    const unregisterNameValueMapping = (value: string) => {
      setNameValueMapping((prev) => {
        const { [value]: _, ...rest } = prev
        return rest
      })
    }

    /***** EFFECTS *****/
    useSelectFieldKeyboardState({
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
          <FieldLabel errors={errors} className={className} name={name}>
            {label}
          </FieldLabel>
          <div className={classes.inputWrapper}>
            <InputField
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
                  console.log(e.key)
                  switch(e.key) {
                    case 'Escape': {
                      e.stopPropagation();
                      toggleIsSearching(false);
                      return toggleIsOpen(false);
                    }
                    case 'Enter': {
                      e.stopPropagation();
                      toggleIsOpen();

                      if (isOpen) {
                        toggleIsSearching(false);
                      } else {
                        toggleIsSearching(true);
                      }
                      return;
                    }
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
                    case 'ArrowUp': {
                      e.stopPropagation();
                      toggleIsOpen(false);
                      return toggleIsSearching(false);
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
            {React.Children.count(children) === 0 && (<div>No results found</div>)}
            {children}
          </div>
        </div>
      </SelectContext.Provider>
    );
  }

  return Object.assign(SelectField, { Option });
}
