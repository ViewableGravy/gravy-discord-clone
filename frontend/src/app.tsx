/***** BASE IMPORTS *****/
import React from 'react'

import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'

/***** UTILITIES *****/
import { useApplicationBootProcess } from './routes/-useApplicationBootProcess';
import { useAuthorizationSocket } from './utilities/hooks/useSocket';

/***** SHARED *****/
import { Lightbox } from './components/lightbox';

/***** CONSTS *****/
import './_global.scss';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 3,
    }
  }
})

export const router = createRouter({ 
  routeTree, 
  context: {
    applicationLoading: true,
    authorizationLevel: null
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const InnerApp = () => {
  /***** HOOKS *****/
  const { applicationLoading } = useApplicationBootProcess()
  const { level } = useAuthorizationSocket(({ authorization }) => authorization)
  
  /***** RENDER *****/
  return (
    <>
      <Lightbox isOpen={applicationLoading}>
        Cooking up some spaghetti
      </Lightbox>
      {!applicationLoading && (
        <RouterProvider 
          router={router} 
          context={{
            applicationLoading, 
            authorizationLevel: level 
          }} 
        />
      )}
    </>
  )
}

export const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <InnerApp />
      </QueryClientProvider>
    </React.StrictMode>
  )
}