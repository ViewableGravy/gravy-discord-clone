import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './_global.scss';

import { routeTree } from './routeTree.gen'
import { useApplicationBootProcess } from './routes/-useApplicationBootProcess';
import { useSocket } from './utilities/hooks/useSocket';
import { Lightbox } from './components/lightbox';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 3,
    }
  }
})

const router = createRouter({ 
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
  const { applicationLoading } = useApplicationBootProcess()
  const { level } = useSocket(({ authorization }) => authorization)
  
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

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  </React.StrictMode>
)
