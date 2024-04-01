import { createFileRoute } from '@tanstack/react-router'
import { Modal } from '../../components/modal'

import background from '../../assets/login-background.svg';
import { Text } from '../../components/utility/text';
import { z } from 'zod';

import './_Register.scss';
import { FieldLabel } from '../../components/form/general/label/label';
import { Padding } from '../../components/utility/padding';
import { Flex } from '../../components/utility/flex';
import { Button } from '../../components/button';
import { Anchor } from '../../components/Anchor';
import classNames from 'classnames';
import { useMatchMedia } from '../../utilities/hooks/useMatchMedia';
import { useAppViewport } from '../../utilities/hooks/useMedia';
import { useRegistrationForm } from './-form';
import { API } from '../../api/queries';
import { AxiosError } from 'axios';
import { useState } from 'react';

const validators = {
  email: z.string().email(),
  username: z.string().min(3, 'Username must be atleast 3 characters'),
  displayName: z.string().min(3, 'Display name must be atleast 3 characters'),
  password: z.string().min(8, 'A password must be provided'),
  dob: {
    day: z.string().min(1, 'A day must be provided'),
    month: z.number().min(1, 'A month must be provided'),
    year: z.number().min(1, 'A year must be provided')
  },
  notifications: z.boolean()
} as const;

const RegistrationRoute = () => {
  /***** HOOKS *****/
  const isMobile = useMatchMedia({ max: 510 })
  const isTiny = useAppViewport(['xs'])

  /***** STATE *****/
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | undefined>(undefined)

  /***** FORM *****/
  const form = useRegistrationForm();
  
  /***** QUERIES *****/
  const { mutateAsync: checkUsernameAsync } = API.MUTATIONS.account.useCheckUsernameAvailabilityMutation();
  const result = API.MUTATIONS.account.useCreateAccountMutationState().at(-1)

  /***** FUNCTIONS *****/
  const getFieldErrors = (field: string) => {
    if (!(result?.error instanceof AxiosError))
      return undefined;

    const { data } = result.error.response?.data;
    return data?.fieldErrors?.[field]
  }

  /***** RENDER *****/
  return (
    <Modal 
      isOpen 
      fade={{ modal: false, content: !isMobile }} 
      className={classNames('Register', { 
        "Register--mobile": isMobile, 
        "Register--tiny": isTiny,
        "Register--error": result?.status === 'error'
      })}
      background={(
        <img 
          src={background} 
          alt="background" 
          style={{ height: '100%', width: '100%' }} 
        />
      )}
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit()
      }}>
        <Padding margin bottom="large">
          <Text xxxl semiBold align-center>Create an account</Text>
        </Padding>
        <form.InputField 
          required
          className="Register__field"
          name="email"
          intrinsic={{ autoComplete: 'email webauthn' }} 
          validators={{ onChange: validators.email }} 
          label={<Text span sm bold uppercase>email</Text>}
          manualError={getFieldErrors('email')}
        />
        <form.InputField
          className="Register__field"
          name="displayName" 
          intrinsic={{ autoComplete: 'username' }}
          label={<Text span sm bold uppercase>display name</Text>}
          selectedMessage="This is how others see you. You can use special characters and Emojies."
        />
        <form.InputField 
          required
          className="Register__field Register__field--username"
          name="username" 
          intrinsic={{ autoComplete: 'username webauthn' }}
          validators={{ 
            onChange: validators.username,
            onChangeAsyncDebounceMs: 500, 
            onChangeAsync({ value }) {
              checkUsernameAsync({ username: value.toLowerCase() })
                .then(({ data }) => setIsUsernameAvailable(!data.exists))
                .catch(() => setIsUsernameAvailable(undefined))

              return undefined;
            }
          }} 
          label={<Text span sm bold uppercase>username</Text>}
          manualError={
            isUsernameAvailable === false 
              ? "Username is unavailable. Try adding more characters."
              : getFieldErrors('username')
          }
          selectedMessage={
            isUsernameAvailable === undefined 
              ? "Please only use numbers, letters, underscores or full stops."
              : isUsernameAvailable
                ? <Text success>Username is available. Nice!</Text>
                : undefined
          }
        />
        <form.InputField 
          required
          intrinsic={{ autoComplete: 'new-password webauthn' }}
          validators={{ onChange: validators.password }} 
          label={<Text span sm bold uppercase>password</Text>}
          className="Register__field"
          name="password"
          manualError={getFieldErrors('password')}
        />

        <Flex 
          column={isTiny} 
          align={isTiny ? 'flex-start' : 'flex-end'} 
          justify={isTiny ? 'flex-start' : 'space-between'} 
          gap={10}
        >
          <form.SelectField 
            className="Register__select" 
            placeholder="Day" 
            name='dob.day'
            label={(
              <FieldLabel.Required 
                label="Date of birth" 
                uppercase 
              />
            )}
          >
            {Array.from({ length: 31 }).map((_, i) => (
              <form.SelectField.Option key={i} value={i + 1}>{i + 1}</form.SelectField.Option>
            ))}
          </form.SelectField>

          <form.SelectField className="Register__select" name='dob.month' placeholder="Month">
            <form.SelectField.Option value="January">January</form.SelectField.Option>
            <form.SelectField.Option value="February">February</form.SelectField.Option>
            <form.SelectField.Option value="March">March</form.SelectField.Option>
            <form.SelectField.Option value="April">April</form.SelectField.Option>
            <form.SelectField.Option value="May">May</form.SelectField.Option>
            <form.SelectField.Option value="June">June</form.SelectField.Option>
            <form.SelectField.Option value="July">July</form.SelectField.Option>
            <form.SelectField.Option value="August">August</form.SelectField.Option>
            <form.SelectField.Option value="September">September</form.SelectField.Option>
            <form.SelectField.Option value="October">October</form.SelectField.Option>
            <form.SelectField.Option value="November">November</form.SelectField.Option>
            <form.SelectField.Option value="December">December</form.SelectField.Option>
          </form.SelectField>

          <form.SelectField className="Register__select" name='dob.year' placeholder="Year">
            {Array.from({ length: 100 }).map((_, i) => (
              <form.SelectField.Option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </form.SelectField.Option>
            ))}
          </form.SelectField>
        </Flex>
        {/* Date of birth field errors */}
        {getFieldErrors('dob') && (
          <Padding margin top="small">
            <Text error sm>{getFieldErrors('dob')}</Text>
          </Padding>
        )}
        <Padding margin top="small">
          <form.CheckboxField name="notifications">
            (Optional) it's okay to send me emails with Tancord updates, tips and special offers. You can opt out at any time.
          </form.CheckboxField>
        </Padding>
        <Padding margin top="large" bottom="medium">
          <Button disabled={form.state.isSubmitting || form.state.errors.length > 0} full type="submit">Continue</Button>
        </Padding>
        <Text tertiary sm>
          By registering, you agree to Tancord's
          <Anchor.Link to="/terms-of-service"><Text sm span link> Terms of Service </Text></Anchor.Link>
          and 
          <Anchor.Link to="/privacy-policy"><Text sm span link> Privacy Policy</Text></Anchor.Link>
        </Text>
        <Padding margin top="large">
          <Anchor.Link to="/login">Already have an account?</Anchor.Link>
        </Padding>
      </form>
    </Modal>
  )
}

export const Route = createFileRoute('/register/')({
  component: RegistrationRoute
})