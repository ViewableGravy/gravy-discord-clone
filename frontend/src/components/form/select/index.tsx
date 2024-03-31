/***** BASE IMPORTS *****/
import { DeepKeys, FieldMeta, FormApi, UseField } from "@tanstack/react-form";
import React, { createContext, CSSProperties, useContext, useEffect, useRef } from "react";
import { Validator } from "@tanstack/form-core";
import classNames from "classnames";

/***** SHARED *****/
import { FieldLabel } from "../general/label/label";
import { Text } from "../../utility/text";
import { StyledInput } from "../input/styled";

/***** UTILITIES *****/
import { useToggleState } from "../../../utilities/hooks/useToggleState";
import { useClickAway } from "../../../utilities/hooks/useClickAway";
import { useTheme } from "../../../utilities/hooks/useTheme";
import { useSelectFieldKeyboardEffect } from "./useKeyboardEvents";

/***** CONSTS *****/
import './_Select.scss';
import { ChevronRight } from "../../../assets/icons/chevron-right";

/***** TYPE DEFINITIONS *****/
type TSelectContext = {
  name: string;

  /** This is the list of options that are currently visible */
  visibleOptions: Array<[value: string, children: string | number]> | boolean;
  
  /** Functions for registering the option with select component */
  registerNameValueMapping: (mapping: Record<string, string | number>) => void;
  unregisterNameValueMapping: (value: string) => void;
  
  /** Functions for toggling the state of the select component */
  toggleIsSearching: (state?: boolean | undefined) => void;
  toggleIsOpen: (state?: boolean | undefined) => void;

  /** Refs for the search input field */
  searchRef: React.RefObject<HTMLInputElement>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

const SelectContext = createContext<TSelectContext>({
  name: '',
  visibleOptions: [],
  setSearchValue: () => {},
  toggleIsSearching: () => {},
  registerNameValueMapping: () => {},
  unregisterNameValueMapping: () => {},
  toggleIsOpen: () => {},
  searchRef: {} as any
});

export const useSelectContext = (_value?: unknown) => {  
  const { visibleOptions, ...rest } =  useContext(SelectContext);

  const getIsVisible = () => {
    if (typeof visibleOptions === 'boolean') {
      return visibleOptions
    }

    return visibleOptions?.some?.(([value]) => String(value) === String(_value)) ?? true;
  }

  return {
    ...rest,
    isVisible: getIsVisible()
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
      searchRef,
      setSearchValue,
      isVisible,
      name, 
      toggleIsSearching, 
      toggleIsOpen,
      registerNameValueMapping, 
      unregisterNameValueMapping
    } = useSelectContext(value);
    const [{ primary, form: themedForm }] = useTheme(({ backgroundColor }) => backgroundColor); 
    const { handleChange, state } = form.useField({ name: name as any });
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      registerNameValueMapping({ [value]: children })

      return () => {
        unregisterNameValueMapping(value)
      }
    }, [value, children])

    /***** RENDER HELPERS *****/
    const classes = classNames("SelectField__option", {
      "SelectField__option--selected": state.value === String(value), 
    })
    const styles = {
      '--background-color': primary,
      '--background-color-hover': themedForm.select.hover,
      '--background-color-selected': themedForm.select.selected,
    } as CSSProperties;

    /***** RENDER *****/
    return (
      <>
        {!isVisible ? null : (
          <button 
            type="button"
            ref={buttonRef}
            style={styles}
            className={classes}
            onClick={() => {
              handleChange(value)
              setSearchValue(String(children))
              toggleIsSearching(false)
              toggleIsOpen(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                toggleIsSearching(false)
                toggleIsOpen(false)
              }
              if (e.key === 'Enter') {
                e.preventDefault();
                handleChange(value)
                toggleIsSearching(false)
                toggleIsOpen(false)
              }
              if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
                e.preventDefault();
                const nextElement = e.key === 'ArrowDown' ? buttonRef.current?.nextElementSibling : buttonRef.current?.previousElementSibling;

                if (nextElement instanceof HTMLElement) {
                  nextElement.focus();
                }
              }

              // update search value
              if (e.key.length === 1) {
                searchRef.current?.focus()
              }
              if (e.key === 'Backspace') {
                searchRef.current?.focus()
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
    const clickawayRef = useClickAway<HTMLDivElement>(() => {
      toggleIsOpen(false)
      toggleIsSearching(false)
    });
    const { state, handleChange, handleBlur } = form.useField({
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validators
    });

    /***** STATE *****/
    const [isOpen, toggleIsOpen] = useToggleState()
    const [isSearching, toggleIsSearching] = useToggleState()
    const searchRef = useRef<HTMLInputElement>(null)
    const [options, setOptions] = React.useState<Record<string, string | number>>({})
    const [searchValue, setSearchValue] = React.useState<string>('')

    /***** FUNCTIONS *****/
    const registerOption = (mapping: Record<string, string | number>) => {
      setOptions((prev) => ({ ...prev, ...mapping }))
    }

    const unregisterOption = (value: string) => {
      setOptions((prev) => {
        const { [value]: _, ...rest } = prev
        return rest
      })
    }

    /***** EFFECTS *****/
    useSelectFieldKeyboardEffect({
      inputRef: searchRef,
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
      input: classNames("SelectField__input", {
        "SelectField__input--hidden": isOpen || isSearching
      }),
      chevron: classNames("SelectField__chevron", {
        "SelectField__chevron--open": isOpen,
      }),
      dropdown: classNames("SelectField__dropdown", {
        "SelectField__dropdown--up": direction === "up" || !direction,
        "SelectField__dropdown--down": direction === "down",
        "SelectField__dropdown--hasLabel": label
      })
    }
    const visibleOptions = !searchValue || searchValue === '' ? true : Object.entries(options).filter(([_, value]) => String(value).toLowerCase().includes(searchValue.toLowerCase()))
    const context = {
      name,
      visibleOptions,
      toggleIsSearching,
      registerNameValueMapping: registerOption,
      unregisterNameValueMapping: unregisterOption,
      toggleIsOpen,
      searchRef,
      setSearchValue
    };

    /***** RENDER *****/
    return (
      <SelectContext.Provider value={context}>
        <div ref={clickawayRef} className={classes.outer}>
          <FieldLabel render={!!label} errors={isSearching || isOpen ? [] : errors} name={name}>
            {label}
          </FieldLabel>
          <div className={classes.inputWrapper}>
            {/* Input field (Searching + displaying) */}
            {isSearching || isOpen ? (
              <StyledInput
                name={`${name}-search`}
                value={searchValue}
                onChange={setSearchValue}
                ref={searchRef}
                intrinsic={{
                  onKeyDown(e) {
                    switch(e.key) {
                      case 'Tab':
                      case 'Shift':
                        return;
                      case 'ArrowUp': {
                        e.preventDefault();
                        const lastOption = clickawayRef.current?.querySelector('.SelectField__option:last-child');
                        if (lastOption instanceof HTMLElement) {
                          lastOption.focus();
                        }
                        return;
                      }
                      case 'ArrowDown': {
                        e.preventDefault();
                        const firstOption = clickawayRef.current?.querySelector('.SelectField__option');
                        if (e.key === 'ArrowDown' && firstOption instanceof HTMLElement) {
                          firstOption.focus();
                        }
                        return;
                      }
                      case 'Enter': {
                        e.preventDefault();
                        toggleIsOpen(false)
                        toggleIsSearching(false)

                        if (typeof visibleOptions === 'boolean') {
                          return
                        }

                        if (visibleOptions.length === 0) {
                          return
                        }

                        const value = visibleOptions.at(-1)?.[0]
                        return handleChange(value as any)
                      }
                      case 'Escape': {
                        e.preventDefault();
                        toggleIsOpen(false)
                        toggleIsSearching(false)
                        return;
                      }
                      default:
                        return; // do nothing, this is handled by the onChange callback
                    }
                  },
                  onClick(e) {
                    e.preventDefault();
                    toggleIsOpen(false)
                    toggleIsSearching(false)
                    setSearchValue('')
                  }
                }}
              />
            ) : (
              <StyledInput
                name={name}
                placeholder={placeholder}
                className={classes.input}
                value={String(options[state.value] ?? '')}
                onChange={(value: any) => {
                  toggleIsOpen(true)
                  toggleIsSearching(true)
                  setSearchValue(String(options[value] ?? ''))
                  return void setTimeout(() => {
                    searchRef.current?.focus()
                  })
                }}
                onBlur={handleBlur}
                intrinsic={{ 
                  autoFocus: isSearching || isOpen,
                  autoComplete: 'off',
                  onKeyDown(e) {
                    switch(e.key) {
                      case 'Tab':
                      case 'Shift':
                        return;
                      case 'ArrowUp': {
                        e.preventDefault();
                        toggleIsOpen(true)
                        return void setTimeout(() => {
                          const lastOption = clickawayRef.current?.querySelector('.SelectField__option:last-child');
                          if (lastOption instanceof HTMLElement) {
                            lastOption.focus();
                          }
                        });
                      }
                      case 'ArrowDown': {
                        e.preventDefault();
                        toggleIsOpen(true)
                        return void setTimeout(() => {
                          const firstOption = clickawayRef.current?.querySelector('.SelectField__option');
                          if (firstOption instanceof HTMLElement) {
                            firstOption.focus();
                          }
                        });
                      }
                      case 'Enter': {
                        e.preventDefault();
                        toggleIsOpen(true)
                        setSearchValue(String(options[state.value] ?? ''))
                        return void setTimeout(() => {
                          searchRef.current?.focus()
                        })
                      }
                    }

                    if (e.key.length === 1) {
                      e.preventDefault();
                      toggleIsOpen(true)
                      toggleIsSearching(true)
                      setSearchValue(String(state.value ?? '') + e.key)
                      return void setTimeout(() => {
                        searchRef.current?.focus()
                      })
                    }
                  },
                  onClick(e) {
                    e.preventDefault();
                    toggleIsOpen(true)
                    toggleIsSearching(true)
                    setSearchValue(String(options[state.value] ?? ''))
                    return void setTimeout(() => {
                      searchRef.current?.focus()
                    })
                  }
                }}
              />
            )}

            {/* Chevron overlay */}
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
