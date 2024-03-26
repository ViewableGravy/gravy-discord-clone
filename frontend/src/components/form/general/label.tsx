/***** BASE IMPORTS *****/
import { ValidationError } from "@tanstack/react-form";
import classNames from "classnames";

/***** UTILITIES *****/
import { Text } from "../../utility/text";

/***** TYPE DEFINITIONS *****/
type TFieldLabel = React.FC<{
  children: React.ReactNode;
  errors: ValidationError[];
  className?: string;
  name: string;
}>

/***** COMPONENT START *****/
export const FieldLabel: TFieldLabel = ({ children, errors, className, name }) => {
  return (
    <>
      {!!children && (
        <label className={classNames("FieldLabel", className)} htmlFor={name}>
          <Text span secondary={!errors.length} error={!!errors.length} >
            {children} <Text italic span sm>{!!errors.length && `- ${errors[0]}`}</Text>
          </Text>
        </label>
      )}
    </>
  )
}