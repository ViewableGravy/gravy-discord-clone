/***** BASE IMPORTS *****/
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { useFormFields } from '../../components/form/input'
import { Button } from '../../components/Button'

/***** COMPONENT START *****/
const Login = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: ''
    },
    onSubmit: ({ value }) => {
      console.log(value)
    }
  })
  
  const { InputField } = useFormFields(form)

  /***** RENDER *****/
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
        <InputField name="email" />
        <InputField name="username" />
        <InputField name="password" />
        <Button type='submit'>Submit</Button>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/login/')({
  component: Login
})