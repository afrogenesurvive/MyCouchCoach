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
      onStartEditLessonBasic={props.onStartEditLessonBasic}
      onStartEditLessonField={props.onStartEditLessonField}
      editingLesson={props.editingLesson}
      editingLessonField={props.editingLessonField}
      cancelEditBasic={props.cancelEditBasic}
      editLessonBasic={props.editLessonBasic}
      cancelEditField={props.cancelEditField}
      editLessonField={props.editLessonField}
      showSchedule={props.showSchedule}
      showScheduleState={props.showScheduleState}
      hideSchedule={props.hideSchedule}
      showSessionBooked={props.showSessionBooked}
      showSessionAttended={props.showSessionAttended}
      hideSessionBooked={props.hideSessionBooked}
      hideSessionAttended={props.hideSessionAttended}
      sessionBookedState={props.sessionBookedState}
      sessionAttendedState={props.sessionAttendedState}
    />

    </div>
  </div>
)

}


export default LessonDetailViewer;
