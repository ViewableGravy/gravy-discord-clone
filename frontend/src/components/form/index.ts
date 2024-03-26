/***** BASE IMPORTS *****/
import { useMemo } from "react";
import { FormApi } from "@tanstack/react-form";

/***** FORM IMPORTS *****/
import { generateInputField } from "./input";
import { generateSelectField } from "./select";

/***** HOOK START *****/
export const useFormFields = <T extends FormApi<any, any>>(form: T) => {
  /***** RENDER HELPERS *****/
  const InputField = useMemo(() => generateInputField(form), [form]);
  const SelectField = useMemo(() => generateSelectField(form), [form]);

  /***** RENDER *****/
  return {
    InputField,
    SelectField
  }
}