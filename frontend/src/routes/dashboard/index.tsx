/***** BASE IMPORTS *****/
import { createFileRoute } from "@tanstack/react-router"

/***** SHARED *****/
import { Button } from "../../components/button"

/***** UTILITIES *****/
import { useBrowserNotification } from "../../utilities/hooks/useBrowserNotification"
import { useLogoutMutation } from "../../api/mutations/useLogoutMutation"

/***** COMPONENT START *****/
const Dashboard = () => {    
    /***** HOOKS *****/  
    const { trigger } = useBrowserNotification();
    const { mutate: logout } = useLogoutMutation()

    /***** FUNCTIONS *****/
    const sendBrowserNotification = () => trigger('hello', {
        body: 'I am the body, some might even say, the powerhouse of the cell'
    })

    /***** RENDER *****/
    return (
        <div>
            <h1>Dashboard | Tests</h1>

            <Button onClick={sendBrowserNotification}>
                Root
            </Button>
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
