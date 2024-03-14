import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../../router"
import { Button } from "../../components/Button"
import { useExampleQuery } from "../../api/queries/useExampleQuery"
import { ChatHeads } from "../../components/ChatHeads"
import ubuntu from "../../assets/ubun.png"

const Dashboard = () => {
    const { isFetching, data } = useExampleQuery();

    return (
        <div>
            <h1>Dashboard | Tests</h1>

            {isFetching && (
                <p>Loading...</p>
            )}

            <Button onClick={() => console.log('hello')}>
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
            <ChatHeads>
                <img src={ubuntu} alt="server-icon" style={{ marginLeft: -10 }}/>
            </ChatHeads>
        </div>
    )
}

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: Dashboard,
})
