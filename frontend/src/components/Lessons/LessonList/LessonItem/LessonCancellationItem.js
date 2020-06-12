import React from 'react';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonCancellationItem = props => (
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
        User:
      </Card.Text>
      <Card.Text>
        ID: {props.user._id}
      </Card.Text>
      <Card.Text>
        Username: {props.user.username}
      </Card.Text>
    </Card.Body>
    </Card>

  </li>
);

export default lessonCancellationItem;
