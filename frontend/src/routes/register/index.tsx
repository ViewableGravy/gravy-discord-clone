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

const validators = {
  email: z.string().email(),
  username: z.string().min(3, 'Username must be atleast 3 characters'),
  displayName: z.string().min(3, 'Display name must be atleast 3 characters'),
  password: z.string().min(8, 'A password must be provided'),
  dob: {
    day: z.union([
      z.number().min(1, 'A day must be provided'),
      z.string().min(1, 'A day must be provided')
    ]),
    month: z.number().min(1, 'A month must be provided'),
    year: z.number().min(1, 'A year must be provided')
  },
  notifications: z.boolean()
} as const;

const RegistrationRoute = () => {
  /***** HOOKS *****/
  const isMobile = useMatchMedia({ max: 510 })
  const isTiny = useAppViewport(['xs'])
  
  /***** QUERIES *****/
  const result = API.MUTATIONS.account.useCreateAccountMutationState()[0]
  console.log(result)

  /***** FORM *****/
  const form = useRegistrationForm();

  /***** RENDER *****/
  return (
    <Modal 
      isOpen 
      fade={{ modal: false }} 
      className={classNames('Register', { "Register--mobile": isMobile, "Register--tiny": isTiny })}
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
        />
        <form.InputField
          required
          className="Register__field"
          name="displayName" 
          intrinsic={{ autoComplete: 'name' }}
          validators={{ onChange: validators.displayName }} 
          label={<Text span sm bold uppercase>display name</Text>}
        />
        <form.InputField 
          required
          className="Register__field"
          name="username" 
          intrinsic={{ autoComplete: 'username webauthn' }}
          validators={{ onChange: validators.username }} 
          label={<Text span sm bold uppercase>username</Text>}
        />
        <form.InputField 
          required
          intrinsic={{ autoComplete: 'new-password webauthn' }}
          validators={{ onChange: validators.password }} 
          label={<Text span sm bold uppercase>password</Text>}
          className="Register__field"
          name="password" 
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
            <form.SelectField.Option value="1">January</form.SelectField.Option>
            <form.SelectField.Option value="2">February</form.SelectField.Option>
            <form.SelectField.Option value="3">March</form.SelectField.Option>
            <form.SelectField.Option value="4">April</form.SelectField.Option>
            <form.SelectField.Option value="5">May</form.SelectField.Option>
            <form.SelectField.Option value="6">June</form.SelectField.Option>
            <form.SelectField.Option value="7">July</form.SelectField.Option>
            <form.SelectField.Option value="8">August</form.SelectField.Option>
            <form.SelectField.Option value="9">September</form.SelectField.Option>
            <form.SelectField.Option value="10">October</form.SelectField.Option>
            <form.SelectField.Option value="11">November</form.SelectField.Option>
            <form.SelectField.Option value="12">December</form.SelectField.Option>
          </form.SelectField>

          <form.SelectField className="Register__select" name='dob.year' placeholder="Year">
            {Array.from({ length: 100 }).map((_, i) => (
              <form.SelectField.Option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </form.SelectField.Option>
            ))}
          </form.SelectField>
        </Flex>
        <Padding margin top="small">
          <form.CheckboxField name="notifications">
            (Optional) it's okay to send me emails with Tancord updates, tips and special offers. You can opt out at any time.
          </form.CheckboxField>
        </Padding>
        <Padding margin top="large" bottom="medium">
          <Button disabled={form.state.isSubmitting} full type="submit">Continue</Button>
        </Padding>
        <Text tertiary sm>
          By registering, you agree to Tancord's
          <Anchor.Link to="/login"><Text sm span link> Terms of Service </Text></Anchor.Link>
          and 
          <Anchor.Link to="/login"><Text sm span link> Privacy Policy</Text></Anchor.Link>
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