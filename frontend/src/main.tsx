import ReactDOM from 'react-dom/client'
import React, { Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

/***** CONSTS *****/
import './_global.scss';
import { queryClient } from './singletons/queryClient';
import { router } from './singletons/router';
import { useApplicationBootProcess } from 'routes/-useApplicationBootProcess';
import { Lightbox } from 'components/lightbox';

const Inner = () => {
  /***** HOOKS *****/
  const { initialized } = useApplicationBootProcess()

  /***** RENDER *****/
    return (
      <>
        <Lightbox isOpen={!initialized}>
          Cooking up some spaghetti
        </Lightbox>
        {!initialized && (
          <RouterProvider router={router} />
        )}
      </>
    )
}

const App = () => {
  return (
    <React.StrictMode>
      <Suspense fallback={<div>Loading</div>} >
        <QueryClientProvider client={queryClient}>
          <Inner />
        </QueryClientProvider>
      </Suspense>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('app')!).render(<App />)

