import React from 'react';
import Button from 'react-bootstrap/Button';
// import UpdateSessionFieldForm from './Forms/lesson/UpdateSessionFieldForm';

import "./AttachmentViewer.css"

const SessionDetailViewer = (props) =>{
  const {...session} = props.session
  console.log("beep",session);
  // let isInstructor = false;
  // if ( session.lessonInstructors.includes(props.authId) === true) {
  //   isInstructor = true
  // }

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">
    <p>SessionDetailViewer</p>

    {
      // <p>{props.authId}</p>
    // {props.editingSessionField === true && (
    //   <UpdateSessionFieldForm
    //     authId={props.authId}
    //     session={props.session}
    //     onConfirm={props.editSessionField}
    //     onCancel={props.cancelEditSessionField}
    //   />
    // )}

    // <Button variant="primary" onClick={props.showSessionBooked}>
    //   Show Booked
    // </Button>
    // <Button variant="primary" onClick={props.hideSessionBooked}>
    //   Hide Booked
    // </Button>
    // <Button variant="primary" onClick={props.showSessionAttended}>
    //   Show Attended
    // </Button>
    // <Button variant="primary" onClick={props.hideSessionAttended}>
    //   Hide Attended
    // </Button>
    //
    // {props.sessionBookedState === true && (
    //   <SessionBookedList
    //   session={props.session}
    //   isInstructor={props.isInstructor}
    //   booked={props.booked}
    //   attended={props.attended}
    //   addSessionAttendance={props.addSessionAttendance}
    // />)}
    // {props.sessionAttendedState === true && (
    //   <SessionAttendedList
    //   attended={props.attended}
    // />)}
    //
    // <Button variant="primary" onClick={props.hideSessionDetails}>
    //       Hide
    //     </Button>
    // {props.editSessionField && (
    //   <Button variant="primary" onClick={props.editSessionField.bind(this, props.session)}>
    //       Edit
    //     </Button>
    //   )}
    }

    </div>
  </div>
)

}


export default SessionDetailViewer;
