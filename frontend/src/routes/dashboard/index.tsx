/***** BASE IMPORTS *****/
import { createFileRoute } from "@tanstack/react-router"

/***** SHARED *****/
import { Button } from "../../components/Button"

/***** UTILITIES *****/
import { useBrowserNotification } from "../../utilities/hooks/useBrowserNotification"
import { useLogoutMutation } from "../../api/mutations/useLogoutMutation"

const Dashboard = () => {      
    const { trigger } = useBrowserNotification();
    const { mutate: logout } = useLogoutMutation()
    

    const sendBrowserNotification = () => trigger('hello', {
        body: 'I am the body, some might even say, the powerhouse of the cell'
    })

    return (
        <div>
            <h1>Dashboard | Tests</h1>

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
