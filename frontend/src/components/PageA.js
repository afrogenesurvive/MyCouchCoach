import React from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';

import "./AttachmentViewer.css"

const PageA = () =>{
  let user = useParams();
return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">

    <Button variant="danger">
      PageA: {user}
    </Button>

    </div>
  </div>
)

}


export default PageA;
