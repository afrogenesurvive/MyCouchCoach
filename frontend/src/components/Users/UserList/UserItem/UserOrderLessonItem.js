import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

import './UserItem.css';

const userOrderLessonItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail2">
    <div>

    <Card className="card">
      <Card.Body>
        <Card.Text>
          {props.sessionDate}
        </Card.Text>
        <Card.Text>
          {props.sessionTitle}
        </Card.Text>

      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userOrderLessonItem;
