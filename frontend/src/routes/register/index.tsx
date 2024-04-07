/***** BASE IMPORTS *****/
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod';
import { AxiosError } from 'axios';
import React, { useState } from 'react';

/***** UTILITIES *****/
import { useAppViewport } from '../../utilities/hooks/useMedia';
import { useRegistrationForm } from './-form';
import { useToggleState } from '../../utilities/hooks/useToggleState';

/***** SHARED *****/
import { Text } from '../../components/utility/text';
import { Padding } from '../../components/utility/padding';
import { Flex } from '../../components/utility/flex';
import { Button } from '../../components/button';
import { Anchor } from '../../components/Anchor';

/***** FORM *****/
import { FieldLabel } from '../../components/form/general/label/label';

/***** LOCAL IMPORTS *****/
import { RegistrationModal } from './-registrationModal';

/***** API IMPORTS *****/
import { API } from '../../api/queries';

/***** CONSTS *****/
import './_Register.scss';
import { EyeIcon } from '../../assets/icons/eye';
import { EyeSlashIcon } from '../../assets/icons/eye-slash';

const validators = {
  email: z.string().email(),
  username: z.string().min(3, 'Username must be atleast 3 characters'),
  displayName: z.string().min(3, 'Display name must be atleast 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be atleast 8 characters')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  dob: {
    day: z.string().min(1, 'A day must be provided'),
    month: z.number().min(1, 'A month must be provided'),
    year: z.number().min(1, 'A year must be provided')
  },
  notifications: z.boolean()
} as const;

const OwnEyeIcon = ({ slash, ...rest } : { slash: boolean } & React.SVGProps<SVGSVGElement>) => slash ? <EyeSlashIcon {...rest}/> : <EyeIcon {...rest} />;

/***** COMPONENT START *****/
const RegistrationRoute = () => {
  /***** HOOKS *****/
  const isTiny = useAppViewport(['xs'])

  /***** STATE *****/
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | undefined>(undefined)
  const [showPassword, toggleShowPassword] = useToggleState();

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
  if (result?.status === "success") {
    return (
      <RegistrationModal>
        <Text xxxl align-center>Success</Text>
        <Padding bottom="large" />
        <Text>Thank you for registering. Please check your email to verify your account.</Text>
        <Padding bottom="medium" />
        <Anchor.Link to="/login">Back to login</Anchor.Link>
      </RegistrationModal>
    )
  }
  
  return (
    <RegistrationModal>
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isUsernameAvailable === false)
          return;

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
          key="password"
          intrinsic={{ autoComplete: 'new-password webauthn', type: showPassword ? "text" : "password" }}
          validators={{ onChange: validators.password }} 
          label={{
            left: <Text span sm bold uppercase>password</Text>,
            right: (
              <Padding margin right={5}>
                <OwnEyeIcon slash={!showPassword} onClick={() => toggleShowPassword()} />
              </Padding>
            )
          }}
          className="Register__field"
          name="password"
          manualError={getFieldErrors('password')}
        />

        {/* DOB */}
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
    </RegistrationModal>
  )
}

export const Route = createFileRoute('/register/')({
  component: RegistrationRoute
})