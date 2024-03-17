/***** UTILITIES *****/
import { useTheme } from '../../utilities/hooks/useTheme';

/***** SHARED *****/
import { ChatHeads } from '../ChatHeads';

/***** CONSTS *****/
import ubuntu from '../../assets/ubun.png';
import './_Navbar.scss';

/***** COMPONENT START *****/
export const Navbar = () => {
  /***** HOOKS *****/
  const [{ navbar }] = useTheme((theme) => theme.backgroundColor);

  /***** RENDER HELPERS *****/
  const style = {
    '--navbar-background-color': navbar
  } as React.CSSProperties;

  /***** RENDER *****/
  return (
    <div className="Navbar" style={style}>
      <ChatHeads className="Navbar__ChatHead--first">
          <img src={ubuntu} alt="server-icon" style={{ marginLeft: -3 }}/>
      </ChatHeads>
      <ChatHeads className="Navbar__ChatHead">
          <img src={ubuntu} alt="server-icon" style={{ marginLeft: -3 }}/>
      </ChatHeads>
      <ChatHeads className="Navbar__ChatHead">
          <img src={ubuntu} alt="server-icon" style={{ marginLeft: -3 }}/>
      </ChatHeads>
    </div>
  )
}