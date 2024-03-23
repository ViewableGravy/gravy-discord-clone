import { useMemo } from "react";
import { generateInputField } from "./input";
import { FormApi } from "@tanstack/react-form";

/***** HOOK START *****/
export const useFormFields = <TData extends any extends FormApi<infer _TData, any> ? _TData : never>(form: FormApi<TData>) => {
  const InputField = useMemo(() => generateInputField(form), []);

  return {
    InputField,
  }
}