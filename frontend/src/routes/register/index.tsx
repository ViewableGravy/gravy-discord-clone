import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { createFileRoute } from '@tanstack/react-router'
import { Modal } from '../../components/modal'

import background from '../../assets/login-background.svg';
import { Text } from '../../components/utility/text';
import { useFormFields } from '../../components/form';
import { z } from 'zod';

import './_Register.scss';
import { FieldLabel } from '../../components/form/general/label/label';
import { Padding } from '../../components/utility/padding';
import { Flex } from '../../components/utility/flex';
import { Button } from '../../components/button';
import { Anchor } from '../../components/Anchor';
import { useEffect } from 'react';
import classNames from 'classnames';
import { useMatchMedia } from '../../utilities/hooks/useMatchMedia';
import { useAppViewport } from '../../utilities/hooks/useMedia';

const validators = {
  email: z.string().min(1, 'An email must be provided'),
  username: z.string().min(1, 'A username must be provided'),
  password: z.string().min(1, 'A password must be provided'),
  dob: {
    day: z.union([
      z.number().min(1, 'A day must be provided'),
      z.string().min(1, 'A day must be provided')
    ]),
    month: z.number().min(1, 'A month must be provided'),
    year: z.number().min(1, 'A year must be provided')
  },
  notifications: z.boolean()
}

const RegistrationRoute = () => {
  const isMobile = useMatchMedia({ max: 510 })
  const isTiny = useAppViewport(['xs'])
  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      dob: {
        day: '',
        month: '',
        year: ''
      },
      notifications: false
    } as const,
    validatorAdapter: zodValidator,
  })

  useEffect(() => {
    form.store.subscribe(() => {
      console.log(form.store.state.values)
    })
  }, [])

  const { InputField, SelectField, CheckboxField } = useFormFields(form)

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
      <Padding margin bottom={20}>
        <Text xxxl semiBold align-center>Create an account</Text>
      </Padding>
      <InputField 
        className="Register__field"
        name="email"
        intrinsic={{ autoComplete: 'email webauthn' }} 
        validators={{ onChange: validators.email }} 
        label={<FieldLabel.Required label="email" uppercase />}
      />
      <InputField 
        className="Register__field"
        name="username" 
        intrinsic={{ autoComplete: 'username webauthn' }}
        validators={{ onChange: validators.username }} 
        label={<FieldLabel.Required label="username" uppercase />} 
      />
      <InputField 
        className="Register__field"
        name="password" 
        intrinsic={{ autoComplete: 'new-password webauthn' }}
        validators={{ onChange: validators.email }} 
        label={<FieldLabel.Required label="password" uppercase />} 
      />

      <Flex 
        column={isTiny} 
        align={isTiny ? 'flex-start' : 'flex-end'} 
        justify={isTiny ? 'flex-start' : 'space-between'} 
        gap={10}
      >
        <SelectField 
          className="Register__select" 
          placeholder="Day" 
          name='dob.day' 
          label={(
            <FieldLabel.Required 
              label="Date of birth" 
              uppercase 
            />
          )}
          validators={{ onChange: validators.dob.day }}
        >
          {Array.from({ length: 31 }).map((_, i) => (
            <SelectField.Option key={i} value={i + 1}>{i + 1}</SelectField.Option>
          ))}
        </SelectField>

        <SelectField className="Register__select" name='dob.month' placeholder="Month">
          <SelectField.Option value="1">January</SelectField.Option>
          <SelectField.Option value="2">February</SelectField.Option>
          <SelectField.Option value="3">March</SelectField.Option>
          <SelectField.Option value="4">April</SelectField.Option>
          <SelectField.Option value="5">May</SelectField.Option>
          <SelectField.Option value="6">June</SelectField.Option>
          <SelectField.Option value="7">July</SelectField.Option>
          <SelectField.Option value="8">August</SelectField.Option>
          <SelectField.Option value="9">September</SelectField.Option>
          <SelectField.Option value="10">October</SelectField.Option>
          <SelectField.Option value="11">November</SelectField.Option>
          <SelectField.Option value="12">December</SelectField.Option>
        </SelectField>

        <SelectField className="Register__select" name='dob.year' placeholder="Year">
          {Array.from({ length: 100 }).map((_, i) => (
            <SelectField.Option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</SelectField.Option>
          ))}
        </SelectField>
      </Flex>
      <Padding margin top={8}>
        <CheckboxField name="notifications">
          (Optional) it's okay to send me emails with Tancord updates, tips and special offers. You can opt out at any time.
        </CheckboxField>
      </Padding>
      <Padding margin top={20} bottom={12}>
        <Button full type="submit">Continue</Button>
      </Padding>
      <Text tertiary sm>
        By registering, you agree to Tancord's
        <Anchor.Link to="/login"><Text sm span link> Terms of Service </Text></Anchor.Link>
        and 
        <Anchor.Link to="/login"><Text sm span link> Privacy Policy</Text></Anchor.Link>
      </Text>
      <Padding margin top={20}>
        <Anchor.Link to="/login">Already have an account?</Anchor.Link>
      </Padding>
    </Modal>
  )
}

export const Route = createFileRoute('/register/')({
  component: RegistrationRoute
})