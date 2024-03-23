/***** BASE IMPORTS *****/
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

/***** FORM IMPORTS *****/
import { useFormFields } from '../../components/form/input'

/***** SHARED *****/
import { Button } from '../../components/Button'

/***** CONSTS *****/
import { useTheme } from '../../utilities/hooks/useTheme'

// Let the document know when the mouse is being used
document.body.addEventListener('mousedown', () => {
  document.body.classList.add('using-mouse');
});

// Re-enable focus styling when Tab is pressed
document.body.addEventListener('keydown', function(event) {
  if (event.keyCode === 9) {
    document.body.classList.remove('using-mouse');
  }
});

/***** COMPONENT START *****/
const Login = () => {
  const [{ primary }] = useTheme((theme) => theme.backgroundColor)
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
      <InputField name="email" />
      <InputField name="username" />
      <InputField name="password" />
      <Button full size="large" type="submit">Submit</Button>
    </form>
  )
}

export const Route = createFileRoute('/login/')({
  component: Login
})