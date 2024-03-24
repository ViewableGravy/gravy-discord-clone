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
import './_Login.scss';

import { z } from 'zod'
import { Anchor } from '../../components/Anchor'
import { AxiosError } from 'axios'
import { Flex } from '../../components/utility/flex'
import { useMatchMedia } from '../../utilities/hooks/useMatchMedia'
import classNames from 'classnames'

/***** COMPONENT START *****/
const Login = () => {  
  /***** HOOKS *****/
  const showQR = useMatchMedia({ min: 820 })
  const isMobile = useMatchMedia({ max: 500 })

  /***** QUERIES *****/
  const { mutateAsync: authenticateAsync } = API.MUTATIONS.account.useAuthenticateMutation();

  /***** RENDER HELPERS *****/
  const form = useForm({
    defaultValues: {
      login: '',
      password: ''
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        await authenticateAsync({
          password: value.password,
          username: value.login
        });
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.status !== 200) {
            if ('Invalid credentials' === e.response?.data.data) {
              // once tanstack supports manual errors, we can display
              // the error here
            }
          }
        }
      }
    }
  })
  
  const { InputField } = useFormFields(form)
  const { isSubmitting } = form.state;
  const classes = {
    modal: classNames({
      'LoginModal--mobile': isMobile
    })
  }

  /***** RENDER *****/
  return (
    <Modal 
      isOpen 
      fade={{ content: !isMobile, modal: false }}
      background={(
        <img 
          src={background} 
          alt="background" 
          style={{ position: 'absolute', height: '100%' }} 
        />
      )}
      className={classes.modal}
    >
      <Flex>
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }} 
          style={{ width: 400 }}
        >
          <Padding bottom={8} margin>
            <Text xxxl align-center primary>Welcome back!</Text>
          </Padding>
          <Padding bottom={20} margin>
            <Text lg align-center secondary>We're so excited to see you again!</Text>
          </Padding>
          <Padding margin bottom={20}>
            <InputField 
              name="login" 
              label={(
                <Text span sm bold>
                  EMAIL OR USERNAME <Text span error>*</Text>
                </Text>
              )} 
              intrinsic={{ autoComplete: "username webauthn" }}
              validators={{ 
                onChange: z.string().min(1, 'Login is required'),
              }} 
            />
          </Padding>
          <InputField 
            name="password" 
            label={(
              <Text span sm bold>
                PASSWORD <Text error span>*</Text>
              </Text>
            )} 
            intrinsic={{ autoComplete: "current-password webauthn" }}
            validators={{ 
              onChange: z.string().min(1, 'Password is required'),
            }}
          />
          <Padding margin bottom={20} top={4}>
            <Anchor.Link to="/forgot-password/">
              Forgot your password?
            </Anchor.Link>
          </Padding>
          <Button full size="large" type="submit">
            {isSubmitting ? 'Loading...' : "Login"}
          </Button>
          <Padding margin top={8}>
            <Text secondary>
              Need an account? <Anchor.Link to="/register">Register</Anchor.Link>
            </Text>
          </Padding>
        </form>
        {showQR && (
          <>
            <div style={{ margin: 30 }} />
            <div style={{ width: 240 }}>
              <Flex column align="center">
                <Padding margin top={30} bottom={30}>
                  <div style={{ width: 176, height: 176, background: '#cecece', marginInline: 30, borderRadius: 5 }}></div>
                </Padding>
                <Padding margin bottom={8}>
                  <Text xxxl>Log in with QR Code</Text>
                </Padding>
                <Text lg secondary align-center>Scan this with the <Text lg span secondary semiBold>Discord mobile app</Text> to log in instantly.</Text>
              </Flex>
            </div>
          </>
        )}
      </Flex>
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