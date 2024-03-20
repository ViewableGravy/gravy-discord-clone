/***** CONSTS *****/
import React from 'react';
import './InnerNavbar.scss';

/***** TYPE DEFINITIONS *****/
type TSidebar = React.FC<{
  children: React.ReactNode;
}>

export const Sidebar: TSidebar = ({children}) => {
  return(
    <div className="SideBar">
      {React.Children.map(children, (child, index) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  )
}
