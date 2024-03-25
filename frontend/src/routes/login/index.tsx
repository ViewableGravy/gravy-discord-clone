/***** BASE IMPORTS *****/
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { AxiosError } from 'axios'
import classNames from 'classnames'

/***** FORM IMPORTS *****/
import { useFormFields } from '../../components/form'

/***** SHARED *****/
import { Button } from '../../components/button'
import { Modal } from '../../components/modal'
import { Text } from '../../components/utility/text'
import { Padding } from '../../components/utility/padding'
import { Anchor } from '../../components/Anchor'
import { Flex } from '../../components/utility/flex'

/***** UTILITIES *****/
import { _socketStore } from '../../utilities/hooks/useSocket'
import { useMatchMedia } from '../../utilities/hooks/useMatchMedia'

/***** QUERIES *****/
import { API } from '../../api/queries'

/***** LOCAL COMPONENTS *****/
import { QRCode } from './-components/qrCode'

/***** CONSTS *****/
import background from '../../assets/login-background.svg';
import './_Login.scss';

const validators = {
  login: z.string().min(1, 'Login is required'),
  password: z.string().min(1, 'Password is required'),
}

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
    }),
    background: "LoginModal__background",
    form: "Login__form",
  }

  /***** RENDER *****/
  return (
    <Modal 
      isOpen 
      fade={{ content: !isMobile, modal: false }}
      className={classes.modal}
      background={(
        <img 
          src={background} 
          alt="background" 
          className={classes.background}
        />
      )}
    >
      <Flex>
        <form 
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }} 
        >
          <Padding bottom={8} margin>
            <Text xxxl align-center primary>
              Welcome back!
            </Text>
          </Padding>
          <Padding bottom={20} margin>
            <Text lg align-center secondary>
              We're so excited to see you again!
            </Text>
          </Padding>
          <Padding margin bottom={20}>
            <InputField 
              name="login" 
              intrinsic={{ autoComplete: "username webauthn" }}
              validators={{ onChange: validators.login }} 
              label={(
                <Text span sm bold>
                  EMAIL OR USERNAME <Text span error>*</Text>
                </Text>
              )} 
            />
          </Padding>
          <InputField 
            name="password" 
            intrinsic={{ autoComplete: "current-password webauthn" }}
            validators={{ onChange: validators.password }}
            label={(
              <Text span sm bold>
                PASSWORD <Text error span>*</Text>
              </Text>
            )} 
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
            <Text tertiary>
              Need an account? <Anchor.Link to="/register">Register</Anchor.Link>
            </Text>
          </Padding>
        </form>
        {showQR && (
          <>
            <Padding margin all={30} />
            <QRCode />
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