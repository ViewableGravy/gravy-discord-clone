import React from 'react';
/***** CONSTS *****/
import './InnerNavbar.scss';

/***** TYPE DEFINITIONS *****/
type TSidebar = React.FC<{
  children: React.ReactNode;
}>

export const Sidebar: TSidebar = ({ children }) => {
  return (
    <div className="SideBar">
      {children}
    </div>
  )
}
