/***** BASE IMPORTS *****/
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { createFileRoute, redirect } from '@tanstack/react-router'

/***** FORM IMPORTS *****/
import { useFormFields } from '../../components/form'

/***** SHARED *****/
import { Button } from '../../components/button'
import { Modal } from '../../components/modal'
import { Text } from '../../components/utility/text'
import { Padding } from '../../components/utility/padding'

/***** UTILITIES *****/
import { _socketStore } from '../../utilities/hooks/useSocket'

/***** QUERIES *****/
import { API } from '../../api/queries'

/***** CONSTS *****/
import background from '../../assets/login-background.svg';
import { z } from 'zod'

/***** COMPONENT START *****/
const Login = () => {  
  const { mutate: authenticate } = API.MUTATIONS.account.useAuthenticateMutation();

  const form = useForm({
    defaultValues: {
      user_identifier: '',
      password: ''
    },
    validatorAdapter: zodValidator,
    validators: {
      onSubmit: z.object({
        user_identifier: z.string().min(1, 'Email or username is required'),
        password: z.string().min(1, 'Password is required')
      })
    },
    onSubmit: ({ value }) => {
      authenticate({
        password: value.password,
        username: value.user_identifier
      });
    }
  })
  
  const { InputField } = useFormFields(form)

  /***** RENDER *****/
  return (
    <Modal 
      isOpen 
      background={(
        <img 
          src={background} 
          alt="background" 
          style={{ position: 'absolute', height: '100%' }} 
        />
      )}
    >
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
            Forgot your password?
          </Button.Link>
        </Padding>
        <Button full size="large" type="submit">Submit</Button>
        <Padding margin top={8}>
          <Text secondary>
            Need an account? <Button.Link to="/register">Register</Button.Link>
          </Text>
        </Padding>
      </form>
    </Modal>
  )
}

export const Route = createFileRoute('/login/')({
  component: Login,
  async beforeLoad({ context }) {
    if (context.authorizationLevel !== 'guest') {
      throw redirect({
        to: '/dashboard'
      })
    }
  }
})