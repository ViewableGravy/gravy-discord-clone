/***** BASE IMPORTS *****/
import { createFileRoute } from '@tanstack/react-router'

/***** COMPONENT START *****/
const Login = () => {

  /***** RENDER *****/
  return (
    <div>
      <h1>Login</h1>
    </div>
  )
}

export const Route = createFileRoute('/login/')({
  component: Login
})