/***** BASE IMPORTS *****/
import { ValidationError } from "@tanstack/react-form";
import classNames from "classnames";

/***** UTILITIES *****/
import { Text } from "../../../utility/text";

/***** CONSTS *****/
import './_FieldLabel.scss';
import { _Required } from "./required";

/***** TYPE DEFINITIONS *****/
type TFieldLabel = React.FC<{
  children: React.ReactNode;
  errors: ValidationError[];
  className?: string;
  name: string;
  render?: boolean;
  intrinsic?: Omit<React.HTMLProps<HTMLLabelElement>, 'htmlFor' | 'className' | 'children'>;
}>

/***** COMPONENT START *****/
const _FieldLabel: TFieldLabel = ({ children, errors, className, name, render = true, intrinsic = {} }) => {
  const firstError = errors[0]?.toString().split(',')[0];
  return (
    <>
      {!!render && (
        <label className={classNames("FieldLabel", className)} htmlFor={name} {...intrinsic}>
          <Text span secondary={!errors.length} error={!!errors.length} >
            {children} <Text italic span sm>{!!errors.length && `- ${firstError}`}</Text>
          </Text>
        </label>
      )}
    </>
  )
}

export const FieldLabel = Object.assign(_FieldLabel, {
  Required: _Required
});
