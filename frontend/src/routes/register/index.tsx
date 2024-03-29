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

const validators = {
  email: z.string().min(1, 'An email must be provided'),
  username: z.string().min(1, 'A username must be provided'),
  password: z.string().min(1, 'A password must be provided'),
  dob: z.object({
    day: z.number().min(1, 'A day must be provided'),
    month: z.number().min(1, 'A month must be provided'),
    year: z.number().min(1, 'A year must be provided')
  }),
  notifications: z.boolean()
}

const RegistrationRoute = () => {

  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      dob: {
        day: '',
        'day--search': '',
        'day--human': '',
        month: '',
        year: ''
      },
      notifications: false
    } as const,
    validatorAdapter: zodValidator,
  })

  const { InputField, SelectField } = useFormFields(form)

  return (
    <Modal 
      isOpen 
      fade={{ modal: false }} 
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

      <Flex align='flex-end' justify='space-between' columnGap={10}>
        <SelectField name='dob.day' label={<FieldLabel.Required label="Date of birth" uppercase />}>
          {Array.from({ length: 31 }).map((_, i) => (
            <SelectField.Option key={i} value={i}>{i}</SelectField.Option>
          ))}
        </SelectField>

        <SelectField name='dob.month'>
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

        <SelectField name='dob.year'>
          <SelectField.Option value="1">One</SelectField.Option>
          <SelectField.Option value="2">Two</SelectField.Option>
          <SelectField.Option value="3">Three</SelectField.Option>
        </SelectField>
      </Flex>
    </Modal>
  )
}

export const Route = createFileRoute('/register/')({
  component: RegistrationRoute
})