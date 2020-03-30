import React from 'react';
import Button from 'react-bootstrap/Button';

import "./AttachmentViewer.css"

const AttachmentViewer = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">
    <h5 className="attachmentViewerTitle">AttachmentViewer</h5>
    <Button variant="danger" className="attachmentViewerCloseButton" onClick={props.onCloseAttachmentView}>
      close
    </Button>

    <a href={props.attachmentFile}>
    <Button variant="success">
      View the Attachment
    </Button>
    </a>
    </div>
  </div>
)

}


export default AttachmentViewer;
