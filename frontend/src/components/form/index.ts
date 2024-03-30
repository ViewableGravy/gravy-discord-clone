/***** BASE IMPORTS *****/
import { useMemo } from "react";
import { FormApi } from "@tanstack/react-form";

/***** FORM IMPORTS *****/
import { generateInputField } from "./input";
import { generateSelectField } from "./select";
import { generateCheckboxField } from "./checkbox";
import { Validator } from "@tanstack/form-core";

/***** HOOK START *****/
export const useFormFields = <
  TData extends Record<string, any>, 
  TValidator extends Validator<TData> | undefined
>(form: FormApi<TData, TValidator>) => {
  /***** RENDER HELPERS *****/
  const InputField = useMemo(() => generateInputField<TData, TValidator>(form), [form]);
  const SelectField = useMemo(() => generateSelectField<TData, TValidator>(form), [form]);
  const CheckboxField = useMemo(() => generateCheckboxField<TData, TValidator>(form), [form]);

  /***** HOOK RESULTS *****/
  return {
    InputField,
    SelectField,
    CheckboxField
  }
}