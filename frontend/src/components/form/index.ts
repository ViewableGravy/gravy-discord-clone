/***** BASE IMPORTS *****/
import { useMemo } from "react";
import { FormApi } from "@tanstack/react-form";

/***** FORM IMPORTS *****/
import { generateInputField } from "./input";

/***** HOOK START *****/
export const useFormFields = (form: FormApi<any, any>) => {
  /***** RENDER HELPERS *****/
  const InputField = useMemo(() => generateInputField(form), [form]);

  /***** RENDER *****/
  return {
    InputField,
  }
}