/***** BASE IMPORTS *****/
import { Outlet, createRootRouteWithContext, redirect, useRouteContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/***** QUERY IMPORTS *****/
import { Sidebar } from "../components/innerNavbar"

/***** SHARED *****/
import { RouteFallbackComponents } from "../components/routeFallbackComponents";
import { Navbar } from "../components/navbar";
import { Button } from "../components/button";

/***** UTILITIES *****/
import { useAuthorizationSocket } from "../utilities/hooks/useSocket";

/***** CONSTS *****/
import discord from '../assets/discord.jpg';
import nvidia from '../assets/nvidia.png';
import spotify from '../assets/spotify.png';
import { Lightbox } from "../components/lightbox";
import { useApplicationBootProcess } from "./-useApplicationBootProcess";

/***** COMPONENT START *****/
const RootRoute = () => {
  /***** HOOKS *****/
  const { applicationLoading } = useApplicationBootProcess()
  const { authorization } = useAuthorizationSocket(({ authorization }) => ({ authorization }));

  if (applicationLoading) {
    <Lightbox isOpen={applicationLoading}>
      Cooking up some spaghetti
    </Lightbox>
  }

  /***** RENDER *****/
  return (
    <>
      {['admin', 'user'].includes(authorization.level ?? '') ? (
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
          <Outlet />
        </div>
      ) : (
        <Outlet />
      )}
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  )
}

/**
 * Context must be exposed in the root route as this is used to generate the context for all other routes
 */
export const Route = createRootRouteWithContext()({
  component: RootRoute,
  notFoundComponent: RouteFallbackComponents.NotFound,
  errorComponent: () => <div>Error!</div>,
  // async beforeLoad({ context, location }) {
  //   // if (location.pathname.startsWith('/authed')) {
  //   //   if (context.authorizationLevel === 'guest') {
  //   //     if (location.pathname !== '/login') {
  //   //       throw redirect({
  //   //         to: '/login',
  //   //         search: {
  //   //           redirect: location.href
  //   //         }
  //   //       })
  //   //     }
  //   //   }
  //   // }
  // }
})