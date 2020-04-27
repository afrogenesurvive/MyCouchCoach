import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import SessionBookedList from '../SessionBookedList';
import SessionAttendedList from '../SessionAttendedList';

import './UserItem.css';

export default function meetingSessionItem (props) {
  return (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Title>{props.title}</Card.Title>
      <Card.Text>
        date: {props.date}
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

    <Button variant="primary" onClick={props.viewSessionDetails.bind(this, props.session)}>
      Details
    </Button>
    </Card>

  </li>
);
}
