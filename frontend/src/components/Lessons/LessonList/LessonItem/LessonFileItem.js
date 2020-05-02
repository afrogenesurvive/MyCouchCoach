import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonFileItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        Name: {props.name}
      </Card.Text>
      <Card.Text>
        Type: {props.type}
      </Card.Text>
      <Card.Text>
        Size: {props.size}
      </Card.Text>
      <Card.Text>
        Path: {props.path}
      </Card.Text>
    </Card.Body>
    </Card>

  </li>
);

export default lessonFileItem;
