import React from 'react';
import Button from 'react-bootstrap/Button';
import LessonDetail from './Lessons/LessonDetail';

import "./AttachmentViewer.css"

const LessonDetailViewer = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">
    <Button variant="danger" className="attachmentViewerCloseButton" onClick={props.onHideLessonDetail}>
      x
    </Button>

    <LessonDetail
      authId={props.authId}
      lesson={props.lesson}
      canReport={props.canReport}
      onReport={props.onReport}
      canDelete={props.canDelete}
      onDelete={props.onDelete}
    />

    </div>
  </div>
)

}


export default LessonDetailViewer;
