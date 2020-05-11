import React from 'react';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userActivityItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        date: {props.activityDate}
      </Card.Text>
      <Card.Text>
        Request: {props.request}
      </Card.Text>
    </Card.Body>
    </Card>

  </li>
);

export default userActivityItem;
