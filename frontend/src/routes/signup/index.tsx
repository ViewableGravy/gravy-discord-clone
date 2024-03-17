import { createFileRoute } from '@tanstack/react-router'

const Signup = () => {

  return (
    <div>
      <h1>Signup</h1>
    </div>
  )
}

export const Route = createFileRoute('/signup/')({
  component: Signup
})