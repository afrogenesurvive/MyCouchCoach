import React from 'react';
import Button from 'react-bootstrap/Button';
import UserDetail from './Users/UserDetail';

import "./AttachmentViewer.css"

const ErrorPage = () =>{

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">

    <Button variant="danger">
      404 Error
    </Button>

    </div>
  </div>
)

}


export default ErrorPage;
