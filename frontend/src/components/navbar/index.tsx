import { useTheme } from '../../utilities/hooks/useTheme';
import './_Navbar.scss';

export const Navbar = () => {
  const [{ navbar }] = useTheme((theme) => theme.backgroundColor);

  const style = {
    '--navbar-background-color': navbar
  } as React.CSSProperties;

  return (
    <div className="Navbar" style={style}></div>
  )
}