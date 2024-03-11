import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../../router"
import { Button } from "../../components/Button"

const Dashboard = () => {

    return (
        <div>
            <h1>Dashboard | Tests</h1>
            <Button onClick={() => console.log("test")} to="">
                Test Click
            </Button>
            <br></br>
            <Button href="https://zuver.net.au">
                Zuver 
            </Button>
            <br></br>
            <Button to="/">
                Root
            </Button>
            <br/>
            <Button.Anchor href="https://boatstore.com">
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
