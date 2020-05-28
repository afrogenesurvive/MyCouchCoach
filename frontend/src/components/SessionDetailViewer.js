import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import SessionBookedList from './Lessons/LessonList/SessionBookedList';
import SessionAttendedList from './Lessons/LessonList/SessionAttendedList';
import UpdateSessionFieldForm from './Forms/lesson/UpdateSessionFieldForm';
import AddReminderForm from './Forms/notification/AddReminderForm';
import AddToCalendar from 'react-add-to-calendar';

import "./AttachmentViewer.css"

const SessionDetailViewer = (props) =>{
  const {...session} = props.session;
  const {...lesson} = props.lesson;
  // console.log('session.endDate',session);
  // console.log("beep",session, session.booked,props.sessionBookedState,session.attended);
  let sessionDate = new Date (session.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
  let sessionEndDate = 0;
  if (session.endDate) {
    sessionEndDate = new Date (session.endDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
  }

  if (props.calendar) {
    sessionDate = props.session.date;
    sessionEndDate = props.session.endDate;
  }
  let isInstructor = false;
  if ( session.lessonInstructors.map(x => x._id).includes(props.authId) === true) {
    isInstructor = true
  }
  // console.log('boop',session.lessonInstructors);
  let hasBooked = false;
  hasBooked = session.booked.map(x => x._id).includes(props.authId);
  // console.log('props.authId',props.authId,'hasBooked',session.booked.map(x => x._id).includes(props.authId));


  // let startTime = session date + session timeout
  // let endTime = session endDate + (session time + lesson duration)

  let calEvent = {
    title: lesson.title+': '+session.title,
    description: lesson.description,
    location: 'Earth',
    startTime: session.date,
    endTime: session.endDate
}

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">
    <p>SessionDetailViewer</p>

    <Card>
    <Card.Body>
    {!props.calendar && (
      <Button variant="danger" onClick={props.hideSessionDetails}>
        X
      </Button>
    )}
    {props.calendar && (
      <Button variant="primary" onClick={props.hideCalendarSessionDetail}>
        Hide
      </Button>
    )}
    {props.calendar &&
        props.onBookSession &&
        hasBooked === false && (
        <Button variant="primary" onClick={props.onBookSession.bind(this, props.session)}>
          Book
        </Button>
    )}
    {props.onAddCartLesson &&
      hasBooked === false && (
      <Button variant="secondary" onClick={props.onAddCartLesson.bind(this, props.session)}>
          Cart
      </Button>
    )}

      <Card.Title>{session.title}</Card.Title>
      <Card.Text>
        lessonType: {props.lessonType}
      </Card.Text>
      <Card.Text>
        isInstructor: {isInstructor.toString()}
      </Card.Text>
      <Card.Text>
        hasBooked: {hasBooked.toString()}
      </Card.Text>
      <Card.Text>
        lesson: {session.lessonTitle}
      </Card.Text>
      <Card.Text>
        date: {sessionDate}
      </Card.Text>
      <Card.Text>
        endDate: {sessionEndDate}
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
      {props.lessonType &&
        props.lessonType !== 'liked' && (
        <Card.Text>
          url: {session.url}
        </Card.Text>
      )}
      <Card.Text>
        bookedAmount: {session.bookedAmount}
      </Card.Text>
      <Card.Text>
        attendedAmount: {session.attendedAmount}
      </Card.Text>
    </Card.Body>

    </Card>

    <Button variant="secondary" onClick={props.startAddSessionReminder}>
      Add Reminder
    </Button>

    {props.calendar &&
      props.lessonType === 'booked' && (
        <Button variant="primary" onClick={props.showSessionBooked}>
          Show Booked
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'booked' && (
        <Button variant="primary" onClick={props.hideSessionBooked}>
          Hide Booked
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'attended' && (
        <Button variant="primary" onClick={props.showSessionBooked}>
          Show Booked
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'attended' && (
        <Button variant="primary" onClick={props.hideSessionBooked}>
          Hide Booked
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'toTeach' && (
        <Button variant="primary" onClick={props.showSessionBooked}>
          Show Booked
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'toTeach' && (
        <Button variant="primary" onClick={props.hideSessionBooked}>
          Hide Booked
        </Button>
    )}


    {props.calendar &&
      props.lessonType === 'attended' && (
        <Button variant="primary" onClick={props.showSessionAttended}>
          Show Attended
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'attended' && (
        <Button variant="primary" onClick={props.hideSessionAttended}>
          Hide Attended
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'toTeach' && (
        <Button variant="primary" onClick={props.showSessionAttended}>
          Show Attended
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'toTeach' && (
        <Button variant="primary" onClick={props.hideSessionAttended}>
          Hide Attended
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'taught' && (
        <Button variant="primary" onClick={props.showSessionAttended}>
          Show Attended
        </Button>
    )}
    {props.calendar &&
      props.lessonType === 'taught' && (
        <Button variant="primary" onClick={props.hideSessionAttended}>
          Hide Attended
        </Button>
    )}


    {props.meeting && (
      <Button variant="primary" onClick={props.showSessionBooked}>
        Show Booked
      </Button>
    )}
    {props.meeting && (
    <Button variant="primary" onClick={props.hideSessionBooked}>
      Hide Booked
    </Button>
    )}
    {props.meeting && (
    <Button variant="primary" onClick={props.showSessionAttended}>
      Show Attended
    </Button>
    )}
    {props.meeting && (
    <Button variant="primary" onClick={props.hideSessionAttended}>
      Hide Attended
    </Button>
    )}

    {props.sessionBookedState === true && (
      <SessionBookedList
        session={props.session}
        isInstructor={isInstructor}
        booked={session.booked}
        attended={session.attended}
        addSessionAttendance={props.addSessionAttendance}
        cancelSessionBooking={props.cancelSessionBooking}
      />)}
    {props.sessionAttendedState === true && (
      <SessionAttendedList
      attended={session.attended}
    />)}



    {props.editSessionField &&
      isInstructor === true &&
      props.lessonType === 'toTeach' && (
      <Button variant="primary" onClick={props.startEditSessionField.bind(this, props.session)}>
          Edit
        </Button>
      )}
    {props.editingSessionField === true &&
      isInstructor === true &&
      props.lessonType === 'toTeach' && (
      <UpdateSessionFieldForm
        authId={props.authId}
        session={props.session}
        onConfirm={props.editSessionField}
        onCancel={props.cancelEditSessionField}
      />
    )}

    {props.editSessionField &&
      isInstructor === true &&
      !props.lessonType && (
      <Button variant="primary" onClick={props.startEditSessionField.bind(this, props.session)}>
          Edit
        </Button>
      )}
    {props.editingSessionField === true &&
      isInstructor === true &&
      !props.lessonType && (
      <UpdateSessionFieldForm
        authId={props.authId}
        session={props.session}
        onConfirm={props.editSessionField}
        onCancel={props.cancelEditSessionField}
      />
    )}

    {props.addingReminder === true && (
      <AddReminderForm
        authId={props.authId}
        session={props.session}
        lesson={props.lesson}
        onConfirm={props.addReminder}
        onCancel={props.cancelAddReminder}
      />
    )}

    {isInstructor === true && (
      <AddToCalendar event={calEvent} />
    )}
    {isInstructor !== true &&
      hasBooked === true && (
      <AddToCalendar event={calEvent} />
    )}


    {

      // <Button variant="info" onClick={props.shareCalendarEvent.bind(this, session)}>
      //   Share Event
      // </Button>

      // {isInstructor == true &&
      //   props.lesson.type === 'Recurring' && (
      //     <Button variant="link" onClick={props.startRepeatSession.bind(this, props.session)}>
      //       Repeat
      //     </Button>
      // )}

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
    }

    </div>
  </div>
)

}


export default SessionDetailViewer;
