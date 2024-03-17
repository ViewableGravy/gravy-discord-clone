/***** UTILITIES *****/
import React, { useMemo } from 'react';
import { useTheme } from '../../utilities/hooks/useTheme';

/***** CONSTS *****/
import './_Navbar.scss';

/***** TYPE DEFINITIONS *****/
type TNavbar = React.FC<{
  children: React.ReactNode;
}>

type TNavbarContext = {
  activeServer: string | null;
  setActiveServer: (server: string) => void;
  initialized: boolean;
}

/***** FUNCTIONS *****/
const NavbarContext = React.createContext<TNavbarContext>({
  activeServer: null,
  setActiveServer: () => void 0,
  initialized: false
});

export const useNavbar = (id: string) => {
  const { activeServer, setActiveServer, initialized } = React.useContext(NavbarContext);

  if (!initialized) {
    throw new Error('useNavbar must be used within a Navbar component');
  }

  return {
    isActiveServer: activeServer === id,
    setActiveServer: () => setActiveServer(id)
  }
}

/***** COMPONENT START *****/
export const _Navbar: TNavbar = ({ children }) => {
  /***** HOOKS *****/
  const [{ navbar }] = useTheme((theme) => theme.backgroundColor);

  /***** STATE *****/
  const [activeServer, setActiveServer] = React.useState<string | null>(null);

  /***** RENDER HELPERS *****/
  const style = {
    '--navbar-background-color': navbar
  } as React.CSSProperties;

  const context = useMemo(() => ({
    activeServer,
    setActiveServer,
    initialized: true
  }), [activeServer])

  /***** RENDER *****/
  return (
    <div className="Navbar" style={style}>
      <NavbarContext.Provider value={context}>
        {children}
      </NavbarContext.Provider>
    </div>
  )
}