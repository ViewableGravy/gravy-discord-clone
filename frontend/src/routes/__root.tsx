import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouteFallbackComponents } from "../components/RouteFallbackComponents";
import { Navbar } from "../components/navbar";
import { useSocket } from "../utilities/hooks/useSocket";
import { Button } from "../components/Button";
import { API } from "../api/queries";

import discord from '../assets/discord.jpg';
import nvidia from '../assets/nvidia.png';
import spotify from '../assets/spotify.png';

const RenderMain = () => {
  const { authorization } = useSocket();
  const { mutate: authenticate } = API.MUTATIONS.account.useAuthenticateMutation();
  const { mutate: createAccount } = API.MUTATIONS.account.useCreateAccountMutation();

  return (
    <main>
      <h1 style={{ fontSize: 30, textTransform: 'capitalize' }}>
        {authorization.level}
      </h1>
      <Button onClick={() => createAccount({ email: 'test@test.com', password: 'test', username: 'test' })}>
        Create Account
      </Button>
      <Button onClick={() => authenticate({ password: 'test', username: 'test' })}>
        Authenticate
      </Button>

      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </main>
  )
}

const RootRoute = () => {
  const { authorization } = useSocket();

  if (['admin', 'user'].includes(authorization.level ?? '')) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', height: '100vh' }}>
        <Navbar>
          <Navbar.Server default className="Navbar__ChatHead--first">
            <img src={discord} alt="server-icon" />
          </Navbar.Server>
          <br />
          <Navbar.Server className="Navbar__ChatHead">
            <img src={nvidia} alt="server-icon" />
          </Navbar.Server>
          <Navbar.Server className="Navbar__ChatHead">
            <img src={spotify} alt="server-icon" style={{ marginLeft: 0 }}/>
          </Navbar.Server>
        </Navbar>
        <RenderMain />
      </div>
    )
  }

  return <RenderMain />
}

export const Route = createRootRoute({
  component: RootRoute,
  notFoundComponent: RouteFallbackComponents.NotFound
})