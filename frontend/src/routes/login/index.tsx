/***** BASE IMPORTS *****/
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

/***** FORM IMPORTS *****/
import { useFormFields } from '../../components/form'

/***** SHARED *****/
import { Button } from '../../components/button'

/***** CONSTS *****/
import { useTheme } from '../../utilities/hooks/useTheme'
import { Modal } from '../../components/modal'
import { Text } from '../../components/utility/text'
import { Padding } from '../../components/utility/padding'

/***** COMPONENT START *****/
const Login = () => {
  const [{ primary }] = useTheme((theme) => theme.backgroundColor)
  const form = useForm({
    defaultValues: {
      user_identifier: '',
      password: ''
    },
    onSubmit: ({ value }) => {
      console.log(value)
    }
  })
  
  const { InputField } = useFormFields(form)

  /***** RENDER *****/
  return (
    <Modal isOpen>
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }} 
      >
        <Padding bottom={8} margin>
          <Text xxxl align-center primary>Welcome back!</Text>
        </Padding>
        <Padding bottom={20} margin>
          <Text lg align-center secondary>We're so excited to see you again!</Text>
        </Padding>
        <Padding margin bottom={20}>
          <InputField 
            name="user_identifier" 
            label={<Text sm secondary bold>EMAIL OR USERNAME</Text>} 
            autoComplete="username webauthn" 
          />
        </Padding>
        <InputField 
          name="password" 
          label={<Text sm secondary bold>PASSWORD</Text>} 
          autoComplete="current-password webauthn" 
        />
        <Padding margin bottom={20} top={4}>
          <Button.Link to="/forgot-password/">
            <Text sm secondary>Forgot your password?</Text>
          </Button.Link>
        </Padding>
        <Button full size="large" type="submit">Submit</Button>
      </form>
    </Modal>
  )
}

export const Route = createFileRoute('/login/')({
  component: Login
})