import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import SessionBookedList from './Lessons/LessonList/SessionBookedList';
import SessionAttendedList from './Lessons/LessonList/SessionAttendedList';
import UpdateSessionFieldForm from './Forms/lesson/UpdateSessionFieldForm';

import "./AttachmentViewer.css"

const SessionDetailViewer = (props) =>{
  const {...session} = props.session
  console.log("beep",session, session.booked,props.sessionBookedState,session.attended);
  const sessionDate = new Date (session.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);;
  let isInstructor = false;
  if ( session.lessonInstructors.includes(props.authId) === true) {
    isInstructor = true
  }

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">
    <p>SessionDetailViewer</p>

    <Card>
    <Card.Body>
    <Button variant="primary" onClick={props.hideSessionDetails}>
      Hide
    </Button>

      <Card.Title>{session.title}</Card.Title>
      <Card.Text>
        isInstructor: {isInstructor.toString()}
      </Card.Text>
      <Card.Text>
        lesson: {session.lessonTitle}
      </Card.Text>
      <Card.Text>
        date: {sessionDate}
      </Card.Text>
      <Card.Text>
        time: {session.time}
      </Card.Text>
      <Card.Text>
        limit: {session.limit}
      </Card.Text>
      <Card.Text>
        amount: {session.amount}
      </Card.Text>
      <Card.Text>
        full: {session.full}
      </Card.Text>
      <Card.Text>
        url: {session.url}
      </Card.Text>
      <Card.Text>
        bookedAmount: {session.bookedAmount}
      </Card.Text>
      <Card.Text>
        attendedAmount: {session.attendedAmount}
      </Card.Text>
    </Card.Body>



    </Card>


    <Button variant="primary" onClick={props.showSessionBooked}>
      Show Booked
    </Button>
    <Button variant="primary" onClick={props.hideSessionBooked}>
      Hide Booked
    </Button>
    <Button variant="primary" onClick={props.showSessionAttended}>
      Show Attended
    </Button>
    <Button variant="primary" onClick={props.hideSessionAttended}>
      Hide Attended
    </Button>

    {props.sessionBookedState === true && (
      <SessionBookedList
      session={props.session}
      isInstructor={isInstructor}
      booked={session.booked}
      attended={session.attended}
      addSessionAttendance={props.addSessionAttendance}
    />)}
    {props.sessionAttendedState === true && (
      <SessionAttendedList
      attended={session.attended}
    />)}



    {props.editSessionField && (
      <Button variant="primary" onClick={props.startEditSessionField.bind(this, props.session)}>
          Edit
        </Button>
      )}
    {props.editingSessionField === true && (
      <UpdateSessionFieldForm
        authId={props.authId}
        session={props.session}
        onConfirm={props.editSessionField}
        onCancel={props.cancelEditSessionField}
      />
    )}
    {
      // <p>{props.authId}</p>

    // {props.editSessionField && (
    //   <Button variant="primary" onClick={props.editSessionField.bind(this, props.session)}>
    //       Edit
    //     </Button>
    //   )}
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


    }

    </div>
  </div>
)

}


export default SessionDetailViewer;
