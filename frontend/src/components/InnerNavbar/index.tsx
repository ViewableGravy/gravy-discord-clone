/***** BASE IMPORTS *****/
import React from 'react';

/***** UTILITIES *****/
import { useTheme } from '../../utilities/hooks/useTheme';

/***** CONSTS *****/
import './InnerNavbar.scss';

/***** TYPE DEFINITIONS *****/
type TSidebar = React.FC<{
  children: React.ReactNode;
}>

export const Sidebar: TSidebar = ({ children }) => {
  /***** HOOKS *****/
  const [{ sidebar }] = useTheme((theme) => theme.backgroundColor);

  /***** RENDER HELPERS *****/
  const style = {
    '--sidebar-background-color': sidebar
  } as React.CSSProperties;

  return (
    <div style={style} className="SideBar">
      {children}
    </div>
  )
}
