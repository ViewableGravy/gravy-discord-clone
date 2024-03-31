/***** BASE IMPORTS *****/
import React, { InputHTMLAttributes } from "react"
import classNames from "classnames";

/***** UTILITIES *****/
import { useUsingKeyboard } from "../../../utilities/hooks/useUsingKeyboard";

/***** CONSTS *****/
import './_Input.scss';

// Redeclare forwardRef to support type inference based on the children
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

/***** TYPE DEFINITIONS *****/
type TTopLevelIntricates = "className" | "placeholder" | "label" | "onChange" | "onBlur" | "value" | "name"

type TInputProps<T extends string> = {
  value: T;
  name: string;
  onChange?: (value: T) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  intrinsic?: Omit<InputHTMLAttributes<HTMLInputElement>, TTopLevelIntricates>;
}

/***** COMPONENT START *****/
const StyledInputInner = (props: TInputProps<string>, ref: React.ForwardedRef<HTMLInputElement>) => {
  const { 
    placeholder, 
    intrinsic = {},
    className,
    onChange = () => void 0,
    onBlur,
    value,
    name
  } = props;

  /***** HOOKS *****/
  const isUsingKeyboard = useUsingKeyboard();
  
  /***** RENDER HELPERS *****/
  const classes = classNames("InputField__input", className, {
    "InputField__input--using-keyboard": isUsingKeyboard
  })

  /***** RENDER *****/
  return (
    <div className={classNames("InputField", className)}>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        name={name}
        id={name}
        className={classes}
        {...intrinsic}
      />
    </div>
  );
}

/***** EXPORTS *****/
export const StyledInput = React.forwardRef(StyledInputInner);