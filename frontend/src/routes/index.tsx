import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { RouteFallbackComponents } from "../components/RouteFallbackComponents";
import { useMedia } from "../utilities/hooks/useMedia";
import { API } from "../api/queries";
import { useSocket } from "../utilities/hooks/useSocket";
import { useExampleQuery } from "../api/queries/useExampleQuery";

const RootRoute = () => {
    const isMobile = useMedia(['xs']);

    const { joinRoom } = useSocket();
    const { mutate } = API.MUTATIONS.useAuthenticateMutation({  })

    const { data, isFetching } = useExampleQuery({ queryKey: [] });

    console.log(data, isFetching)

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', height: '100vh' }}>
            <h1 style={{ backgroundColor: 'mediumseagreen', margin: '0' }}>
                NAVBAR COMPONENT
            </h1>
            <main>
                <Outlet />
                <TanStackRouterDevtools />
            </main>
        </div>
    )
}

export const _rootRoute = createRootRoute({
    component: RootRoute,
    notFoundComponent: RouteFallbackComponents.NotFound
})