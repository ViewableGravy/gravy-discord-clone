import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../../router"

const Dashboard = () => {

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: Dashboard,
})
