import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { createFileRoute } from '@tanstack/react-router'
import { Modal } from '../../components/modal'

import background from '../../assets/login-background.svg';
import { Text } from '../../components/utility/text';
import { useFormFields } from '../../components/form';
import { z } from 'zod';

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
        month: '',
        year: ''
      },
      notifications: false
    } as const,
    validatorAdapter: zodValidator,
  })

  const { InputField } = useFormFields(form)

  const renderLabel = (label: string) => (
    <Text span sm bold>
      {label} <Text error span>*</Text>
    </Text>
  )

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
      <Text xxxl semiBold>Create an account</Text>
      <InputField 
        name="email"
        intrinsic={{ autoComplete: 'email webauthn' }} 
        validators={{ onChange: validators.email }} 
        label={renderLabel('EMAIL')}
      />
      <InputField 
        name="username" 
        intrinsic={{ autoComplete: 'username webauthn' }}
        validators={{ onChange: validators.username }} 
        label={renderLabel('USERNAME')} 
      />
      <InputField 
        name="password" 
        intrinsic={{ autoComplete: 'new-password webauthn' }}
        validators={{ onChange: validators.email }} 
        label={renderLabel('PASSWORD')} 
      />
    </Modal>
  )
}

export const Route = createFileRoute('/register/')({
  component: RegistrationRoute
})