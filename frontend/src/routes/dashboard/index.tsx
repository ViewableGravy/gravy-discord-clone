/***** BASE IMPORTS *****/
import { createFileRoute } from "@tanstack/react-router"

/***** SHARED *****/
import { Button } from "../../components/Button"

/***** QUERY IMPORTS *****/
import { useExampleQuery } from "../../api/queries/useExampleQuery"

/***** UTILITIES *****/
import { useBrowserNotification } from "../../utilities/hooks/useBrowserNotification"
import { Sidebar } from "../../components/InnerNavbar"

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
            <Button.Link to="/">
                Trunk
            </Button.Link>
            <br/>
            <Sidebar>
                <Button.Anchor href="https://lurking.au">Lukas</Button.Anchor>
                <Button.Anchor href="https://gravy.cc">Lleyton</Button.Anchor>
                <p>TEST1</p>
                <p>TEST 2</p>
            </Sidebar>

            
        
        </div>
    )
}

export const Route = createFileRoute('/dashboard/')({
    component: Dashboard
})
