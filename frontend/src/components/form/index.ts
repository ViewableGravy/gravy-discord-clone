import { useMemo } from "react";
import { generateInputField } from "./input";
import { FormApi } from "@tanstack/react-form";

/***** HOOK START *****/
export const useFormFields = (form: FormApi<any, any>) => {
  const InputField = useMemo(() => generateInputField(form), [form]);

  return {
    InputField,
  }
}