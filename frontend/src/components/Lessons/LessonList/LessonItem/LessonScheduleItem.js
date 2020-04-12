import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonScheduleItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
      {props.date.date}, {props.date.time}
      </Card.Text>
    </Card.Body>
    </Card>

  </li>
);

export default lessonScheduleItem;
