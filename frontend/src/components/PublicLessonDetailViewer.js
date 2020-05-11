import React from 'react';
// import Button from 'react-bootstrap/Button';
import PublicLessonDetail from './Lessons/PublicLessonDetail';

import "./AttachmentViewer.css"

const PublicLessonDetailViewer = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">
    <PublicLessonDetail
      lesson={props.lesson}
      onHideLessonDetail={props.onHideLessonDetail}
      showSchedule={props.showSchedule}
      showScheduleState={props.showScheduleState}
      hideSchedule={props.hideSchedule}
    />

    </div>
  </div>
)

}


export default PublicLessonDetailViewer;
