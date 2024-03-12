import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouteFallbackComponents } from "../components/RouteFallbackComponents";

const RootRoute = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', height: '100vh' }}>
            <h1 style={{ backgroundColor: 'mediumseagreen', margin: '0' }}>
                NAVBAR COMPONENT
            </h1>
            <main>
                <Outlet />
                <TanStackRouterDevtools />
                <ReactQueryDevtools />
            </main>
        </div>
    )
}

export const _rootRoute = createRootRoute({
    component: RootRoute,
    notFoundComponent: RouteFallbackComponents.NotFound
})