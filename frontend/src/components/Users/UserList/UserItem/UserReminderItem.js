import React from 'react';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userReminderItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        Send: {props.sendDate} - {props.time}
      </Card.Text>
      <Card.Text>
        Title: {props.title}, Type: {props.type}
      </Card.Text>
      <Card.Text>
        Creator: {props.creator.username}
      </Card.Text>
      <Card.Text>
        Lesson: Title: {props.lesson.title}
      </Card.Text>
      <Card.Text>
        Session: Title: {props.session.title}
      </Card.Text>
      <Card.Text>
        Dates - Start: {props.sessionDate}, End: {props.sessionEndDate}, Time: {props.session.time}
      </Card.Text>
      <Card.Text>
        Trigger: {props.trigger.value}, {props.trigger.unit}
      </Card.Text>
      <Card.Text>
        Delivery: {props.delivery.type}
      </Card.Text>
      <Card.Text>

      </Card.Text>
    </Card.Body>
    </Card>

  </li>
);

export default userReminderItem;
