/***** BASE IMPORTS *****/
import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../../router"

/***** SHARED *****/
import { Button } from "../../components/Button"

/***** QUERY IMPORTS *****/
import { useExampleQuery } from "../../api/queries/useExampleQuery"

/***** UTILITIES *****/
import { useBrowserNotification } from "../../utilities/hooks/useBrowserNotification"

const Dashboard = () => {      
    const { isFetching } = useExampleQuery(); // testing
    const { trigger } = useBrowserNotification();

    const sendBrowserNotification = () => trigger('hello', {
        body: 'I am the body, some might even say, the powerhouse of the cell'
    })

    return (
        <div>
            <h1>Dashboard | Tests</h1>

            {isFetching && (
                <p>Loading...</p>
            )}

            <Button onClick={sendBrowserNotification}>
                Root
            </Button>
            <br/>

            <Button.Anchor href="https://gravy.cc">
                Ship
            </Button.Anchor>
            <br/>

            <Button.Link to="/">
                Trunk
            </Button.Link>
        </div>
    )
}

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: Dashboard,
})
