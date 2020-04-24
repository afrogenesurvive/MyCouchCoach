import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const sessionBookedItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        _id: {props._id}
      </Card.Text>
      <Card.Text>
        username: {props.username}
      </Card.Text>
    </Card.Body>
    </Card>

  </li>
);

export default sessionBookedItem;
