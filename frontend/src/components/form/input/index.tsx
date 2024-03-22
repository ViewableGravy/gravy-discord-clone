import { DeepKeys, FieldMeta, FormApi, useField } from "@tanstack/react-form";
import { zodValidator } from '@tanstack/zod-form-adapter'
import { InputHTMLAttributes, useMemo } from "react";
import classNames from "classnames";
import './_Input.scss';

/***** COMPONENT START *****/
export const generateInputField = <TData extends any extends FormApi<infer _TData, any> ? _TData : never>(form: FormApi<TData>) => {
  type TInputField = React.FC<InputHTMLAttributes<HTMLInputElement> & {
    name: DeepKeys<TData>;
    label?: React.ReactNode;
    defaultMeta?: Partial<FieldMeta>;
    asyncDebounceMs?: number;
  }>

  /**
   * InputField
   * 
   * Does not currently support field level validation due to type issues
   */
  const InputField: TInputField = ({ name, label, defaultMeta, asyncDebounceMs, className, ...intrinsic }) => {
    const { state, handleBlur, handleChange } = useField({
      form,
      name, // typescript is going to think that name can be an object key but tanstack expects a string
      asyncDebounceMs: asyncDebounceMs ?? 200,
      defaultMeta,
      validatorAdapter: zodValidator
    })

    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <input
          {...intrinsic}
          type="text"
          placeholder={name}
          value={state.value}
          onBlur={handleBlur}
          onChange={(e) => handleChange(e.target.value as any)}
          name={name}
          className={classNames(className, 'InputField')}
        />
      </div>
    )
  };

  return InputField;
}

export const useFormFields = <TData extends any extends FormApi<infer _TData, any> ? _TData : never>(form: FormApi<TData>) => {
  const InputField = useMemo(() => generateInputField(form), []);

  return {
    InputField,
  }
}