/***** BASE IMPORTS *****/
import React from 'react';

/***** UTILITIES *****/
import { useTheme } from '../../utilities/hooks/useTheme';

/***** CONSTS *****/
import './_InnerNavbar.scss';

/***** TYPE DEFINITIONS *****/
type TSidebar = React.FC<{
  children: React.ReactNode;
}>

export const Sidebar: TSidebar = ({ children }) => {
  /***** HOOKS *****/
  const [{ primary }] = useTheme((theme) => theme.backgroundColor);

  /***** RENDER HELPERS *****/
  const style = {
    '--sidebar-background-color': primary
  } as React.CSSProperties;

  return (
    <div style={style} className="SideBar">
      {children}
    </div>
  )
}
