/***** BASE IMPORTS *****/
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

/***** FORM IMPORTS *****/
import { useFormFields } from '../../components/form/input'

/***** SHARED *****/
import { Button } from '../../components/Button'

/***** CONSTS *****/
import { useTheme } from '../../utilities/hooks/useTheme'

/***** COMPONENT START *****/
const Login = () => {
  const [{ primary }] = useTheme((theme) => theme.backgroundColor)
  const form = useForm({
    defaultValues: {
      'user_identifier': '',
      password: ''
    },
    onSubmit: ({ value }) => {
      console.log(value)
    }
  })
  
  const { InputField } = useFormFields(form)

  /***** RENDER *****/
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }} 
      style={{ 
        backgroundColor: primary, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 20 
      }} 
    >
      <h1>Login</h1>
      <InputField name="user_identifier" label="EMAIL OR USERNAME" autoComplete="username webauthn" />
      <InputField name="password" label="password" autoComplete="current-password webauthn" />
      <Button full size="large" type="submit">Submit</Button>
    </form>
  )
}

export const Route = createFileRoute('/login/')({
  component: Login
})