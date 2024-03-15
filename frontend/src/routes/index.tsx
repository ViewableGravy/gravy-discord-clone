import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouteFallbackComponents } from "../components/RouteFallbackComponents";
import { Navbar } from "../components/navbar";

const RootRoute = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', height: '100vh' }}>
            <Navbar />
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