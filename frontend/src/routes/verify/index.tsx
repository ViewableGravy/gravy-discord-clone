import { createFileRoute } from '@tanstack/react-router'
import { useSocket } from '../../utilities/hooks/useSocket';
import { useEffect, Validator } from 'react';
import { useVerifyMutation } from '../../api/mutations/useVerifyMutation';
import { z } from 'zod';
import { router } from '../../app';

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

  /***** QUERIES *****/
  const { mutate } = useVerifyMutation();

  /***** EFFECTS *****/
  useEffect(() => {
    if (ready) {
      mutate({ username, token })
    }
  }, [ready])

  return (
    <div>
      <h1>Verifying...</h1>
    </div>
  );
}

Route.update({
  component: Verify
})

