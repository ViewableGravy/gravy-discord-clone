/***** BASE IMPORTS *****/
import { createFileRoute } from "@tanstack/react-router"

/***** SHARED *****/
import { Button } from "../../components/Button"

/***** QUERY IMPORTS *****/
import { useExampleQuery } from "../../api/queries/useExampleQuery"

/***** UTILITIES *****/
import { useBrowserNotification } from "../../utilities/hooks/useBrowserNotification"
import { useLogoutMutation } from "../../api/mutations/useLogoutMutation"

const Dashboard = () => {      
    const { isFetching } = useExampleQuery(); // testing
    const { trigger } = useBrowserNotification();
    const { mutate: logout } = useLogoutMutation()
    

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

            <br/>

            <Button.Link to="/">
                Trunk
            </Button.Link>

            <Button onClick={logout}>
                Logout
            </Button>
        </div>
    )
}

export const Route = createFileRoute('/dashboard/')({
    component: Dashboard
})
