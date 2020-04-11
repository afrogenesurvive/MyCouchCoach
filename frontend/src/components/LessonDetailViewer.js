import React from 'react';
import Button from 'react-bootstrap/Button';
import LessonDetail from './Lessons/LessonDetail';

import "./AttachmentViewer.css"

const LessonDetailViewer = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">
    <LessonDetail
      authId={props.authId}
      lesson={props.lesson}
      sessionsLoaded={props.sessionsLoaded}
      onSessionLoad={props.onSessionLoad}
      onHideSessions={props.onHideSessions}
      onBookSession={props.onBookSession}
      onAddCartLesson={props.onAddCartLesson}
      onHideLessonDetail={props.onHideLessonDetail}
      startCreateSession={props.startCreateSession}
      creatingSession={props.creatingSession}
      cancelCreateSession={props.cancelCreateSession}
      createLessonSession={props.createLessonSession}
    />

    </div>
  </div>
)

}


export default LessonDetailViewer;
