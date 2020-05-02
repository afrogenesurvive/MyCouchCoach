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

      toggleSchedule={props.toggleSchedule}
      showScheduleState={props.showScheduleState}

      showSessionBooked={props.showSessionBooked}
      showSessionAttended={props.showSessionAttended}
      hideSessionBooked={props.hideSessionBooked}
      hideSessionAttended={props.hideSessionAttended}
      sessionBookedState={props.sessionBookedState}
      sessionAttendedState={props.sessionAttendedState}
      addSessionAttendance={props.addSessionAttendance}

      toggleInstructors={props.toggleInstructors}
      showInstructorsState={props.showInstructorsState}
      toggleRequirements={props.toggleRequirements}
      showRequirementsState={props.showRequirementsState}
      toggleMaterials={props.toggleMaterials}
      showMaterialsState={props.showMaterialsState}
      toggleReviews={props.toggleReviews}
      showReviewsState={props.showReviewsState}
      toggleTags={props.toggleTags}
      showTagsState={props.showTagsState}
      toggleImages={props.toggleImages}
      showImagesState={props.showImagesState}
      toggleFiles={props.toggleFiles}
      showFilesState={props.showFilesState}

      lessonAddField={props.lessonAddField}
      startLessonAdd={props.startLessonAdd}
      cancelLessonAdd={props.cancelLessonAdd}
      addLessonInstructor={props.addLessonInstructor}
      addLessonMaterials={props.addLessonMaterials}
      addLessonTags={props.addLessonTags}
      addLessonRequirements={props.addLessonRequirements}
      addLessonImages={props.addLessonImages}
      addLessonFiles={props.addLessonFiles}

      onLikeLesson={props.onLikeLesson}
    />

    </div>
  </div>
)

}


export default LessonDetailViewer;
