/***** BASE IMPORTS *****/
import { zodValidator } from "@tanstack/zod-form-adapter"
import { useForm } from "@tanstack/react-form"

/***** SHARED *****/
import { useFormFields } from "../../components/form"

/***** QUERIES *****/
import { API } from "../../api/queries"
import { useEffect } from "react"

/***** HOOK START *****/
export const useRegistrationForm = () => {
  /***** QUERIES *****/
  const { mutate } = API.MUTATIONS.account.useCreateAccountMutation()

  /***** FORM *****/
  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      displayName: '',
      dob: {
        day: '',
        month: '',
        year: ''
      },
      notifications: false
    },
    validatorAdapter: zodValidator,
    onSubmit: ({ value }) => {
      mutate({
        ...value,
        dob: {
          day: value.dob.day,
          month: value.dob.month,
          year: value.dob.year
        }
      })
    },
  })

  const fields = useFormFields(form);
  
  /***** HOOK RESULTS *****/
  return {
    ...form,
    ...fields
  }
}