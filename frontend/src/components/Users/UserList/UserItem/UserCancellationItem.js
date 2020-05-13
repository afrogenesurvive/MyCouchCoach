import React from 'react';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userCancellationItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        date: {props.date}
      </Card.Text>
      <Card.Text>
        Reason: {props.reason}
      </Card.Text>
      <Card.Text>
        sessionDate: {props.sessionDate}
      </Card.Text>
      <Card.Text>
        sessionTitle: {props.sessionTitle}
      </Card.Text>
      <Card.Text>
        Lesson:
      </Card.Text>
      <Card.Text>
        ID: {props.lesson._id}
      </Card.Text>
      <Card.Text>
        Title: {props.lesson.title}
      </Card.Text>
    </Card.Body>
    </Card>

  </li>
);

export default userCancellationItem;
