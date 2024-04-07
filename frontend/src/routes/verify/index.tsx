import { createFileRoute } from '@tanstack/react-router'
import { useAuthorizationSocket } from '../../utilities/hooks/useSocket';
import { useEffect, Validator } from 'react';
import { useVerifyMutation } from '../../api/mutations/useVerifyMutation';
import { z } from 'zod';
import { router } from '../../app';
import { Modal } from '../../components/modal';
import background from '../../assets/login-background.svg';
import { Text } from '../../components/utility/text';
import { Anchor } from '../../components/Anchor';
import { Padding } from '../../components/utility/padding';
import { Flex } from '../../components/utility/flex';

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
  const { ready } = useAuthorizationSocket(({ readyState }) => ({ ready: readyState === "READY" }));
  const { username, token } = Route.useSearch();

  /***** QUERIES *****/
  const { mutate, isIdle, isError } = useVerifyMutation({ mutationKey: ['verify']});

  /***** EFFECTS *****/
  useEffect(() => {
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
      {!isError && (
        <Text align-center>Verifying...</Text>
      )}

      {isError && (
        <>
          <Text align-center xxxl>Error verifying Account</Text>
          <Padding bottom="medium" />
          <Text>
            Your verification link may have expired or the link provided has already been used.
          </Text>
          <Padding bottom="medium" />
          <Flex column>
            <Anchor.Link to="/login">Already have an account?</Anchor.Link>
            <Anchor.Link to="/register">Create a new account</Anchor.Link>
          </Flex>
        </>
      )}
    </Modal>
  );
}

Route.update({
  component: Verify
})

