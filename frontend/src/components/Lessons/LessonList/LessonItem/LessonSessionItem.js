import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import SessionBookedList from '../SessionBookedList';
import SessionAttendedList from '../SessionAttendedList';

import './UserItem.css';

export default function lessonSessionItem (props) {
  return (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Title>{props.title}</Card.Title>
      <Card.Text>
        date: {props.date}
      </Card.Text>
      <Card.Text>
        endDate: {props.endDate}
      </Card.Text>
      <Card.Text>
        time: {props.time}
      </Card.Text>
      <Card.Text>
        full: {props.full}
      </Card.Text>
      <Card.Text>
        limit: {props.limit}
      </Card.Text>
      <Card.Text>
        amount: {props.amount}
      </Card.Text>
      <Card.Text>
        url: {props.url}
      </Card.Text>
      <Card.Text>
        bookedAmount: {props.bookedAmount}
      </Card.Text>
      <Card.Text>
        attendedAmount: {props.attendedAmount}
      </Card.Text>
    </Card.Body>

    {!props.meetings &&
      props.profile && (
      <Button variant="primary" onClick={props.showSessionBooked}>
        Show Booked
      </Button>
    )}
    {!props.meetings &&
      props.profile && (
    <Button variant="primary" onClick={props.hideSessionBooked}>
      Hide Booked
    </Button>
    )}
    {!props.meetings &&
      props.profile && (
    <Button variant="primary" onClick={props.showSessionAttended}>
      Show Attended
    </Button>
    )}
    {!props.meetings &&
      props.profile && (
    <Button variant="primary" onClick={props.hideSessionAttended}>
      Hide Attended
    </Button>
    )}
    {props.meetings && (
      <Button variant="primary" >
        Details
      </Button>
    )}

    {props.sessionBookedState === true && (
      <SessionBookedList
      session={props.session}
      isInstructor={props.isInstructor}
      booked={props.booked}
      attended={props.attended}
      addSessionAttendance={props.addSessionAttendance}
      cancelSessionBooking={props.cancelSessionBooking}
    />)}
    {props.sessionAttendedState === true && (
      <SessionAttendedList
      attended={props.attended}
    />)}

    {props.onBookSession && (<Button variant="primary" onClick={props.onBookSession.bind(this, props.session)}>
          Book
        </Button>)}
    {props.editSessionField &&
      props.isInstructor === true && (<Button variant="primary" onClick={props.editSessionField.bind(this, props.session)}>
          Edit
        </Button>)}
    {props.onAddCartLesson && (<Button variant="secondary" onClick={props.onAddCartLesson.bind(this, props.session)}>
          Cart
        </Button>)}
    </Card>

  </li>
);
}
