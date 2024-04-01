import { createFileRoute } from '@tanstack/react-router'
import { useSocket } from '../../utilities/hooks/useSocket';
import { useEffect, Validator } from 'react';
import { useVerifyMutation } from '../../api/mutations/useVerifyMutation';
import { z } from 'zod';
import { router } from '../../app';
import { Modal } from '../../components/modal';
import background from '../../assets/login-background.svg';
import { Text } from '../../components/utility/text';

const validateSearch = z.object({
  username: z.string(),
  token: z.string()
})

export const Route = createFileRoute('/verify/')({
  validateSearch,
  onError: () => {
    router.navigate({ 
      to: '/login', 
      from: '/verify', 
      search: { 
        error: 'Invalid token' 
      }
    });
  }
})

const Verify = () => {
  /***** HOOKS *****/
  const { ready } = useSocket(({ readyState }) => ({ ready: readyState === "READY" }));
  const { username, token } = Route.useSearch();

  console.log(token)

  /***** QUERIES *****/
  const { mutate, isIdle } = useVerifyMutation({ mutationKey: ['verify']});

  /***** EFFECTS *****/
  useEffect(() => {
    console.log(isIdle)
    if (ready && isIdle) {
      mutate({ username, token })
    }
  }, [ready, isIdle])

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
      <Text align-center>Verifying...</Text>
    </Modal>
  );
}

Route.update({
  component: Verify
})

