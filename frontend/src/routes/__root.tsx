/***** BASE IMPORTS *****/
import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/***** QUERY IMPORTS *****/
import { API } from "../api/queries";
import { Sidebar } from "../components/InnerNavbar"

/***** SHARED *****/
import { RouteFallbackComponents } from "../components/RouteFallbackComponents";
import { Navbar } from "../components/navbar";
import { Button } from "../components/Button";

/***** UTILITIES *****/
import { useSocket } from "../utilities/hooks/useSocket";
import { useApplicationBootProcess } from "./-useApplicationBootProcess";

/***** CONSTS *****/
import discord from '../assets/discord.jpg';
import nvidia from '../assets/nvidia.png';
import spotify from '../assets/spotify.png';

/***** COMPONENT START *****/
const RenderMain = () => {
  /***** HOOKS *****/
  const { authorization } = useSocket();
  const { mutate: authenticate } = API.MUTATIONS.account.useAuthenticateMutation();
  const { mutate: createAccount } = API.MUTATIONS.account.useCreateAccountMutation();

  /***** RENDER *****/
  return (
    <main>
      <h1 style={{ fontSize: 30, textTransform: 'capitalize' }}>
        {authorization.level}
      </h1>
      {authorization.level === 'guest' && (
        <>
          <Button onClick={() => createAccount({ email: 'test@test.com', password: 'test', username: 'test' })}>
            Create Account
          </Button>
          <Button onClick={() => authenticate({ password: 'test', username: 'test' })}>
            Authenticate
          </Button>
        </>
      )}

      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </main>
  )
}

const RootRoute = () => {
  // top level logic to run when application starts up
  useApplicationBootProcess();

  /***** HOOKS *****/
  const { authorization } = useSocket(({ authorization }) => ({ authorization }));

  /***** RENDER *****/
  if (['admin', 'user'].includes(authorization.level ?? '')) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '70px 240px 1fr', height: '100vh' }}>
        <Navbar>
          <Navbar.Server default className="Navbar__ChatHead--first">
            <img src={discord} alt="server-icon" />
          </Navbar.Server>
          <br />
          <Navbar.Server className="Navbar__ChatHead">
            <img src={nvidia} alt="server-icon" style={{ marginTop: 0 }} />
          </Navbar.Server>
          <Navbar.Server className="Navbar__ChatHead">
            <img src={spotify} alt="server-icon" />
          </Navbar.Server>
        </Navbar>
        <Sidebar>
          <Button.Anchor href="https://lurking.au">Lukas</Button.Anchor>
          <Button.Anchor href="https://gravy.cc">Lleyton</Button.Anchor>
          <p>TEST1</p>
          <p>TEST 2</p>
        </Sidebar>
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