import React from 'react';
import Button from 'react-bootstrap/Button';

import "./SidebarControl.css"

const SidebarControl = (props) =>{
  return (
    <div className="SidebarControl">
      <Button className="sidebarButton" variant="success" onClick={props.onShowSidebar}>+</Button>
      <Button className="sidebarButton" variant="danger" onClick={props.onHideSidebar}>-</Button>
    </div>
  )
}

export default SidebarControl;
