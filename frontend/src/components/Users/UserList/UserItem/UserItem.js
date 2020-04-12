import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        ID: {props._id}
      </Card.Text>
      <Card.Text>
        username: {props.username}
      </Card.Text>
      <Card.Text>
        role: {props.role}
      </Card.Text>
      <Button variant="primary" onClick={props.onDetail.bind(this, props._id)}>
        Details
      </Button>
      {
      //   <Button variant="secondary" onClick={props.onSelectNoDetail.bind(this, props.user)}>
      //   Select
      // </Button>
    }

    </Card.Body>
    </Card>

  </li>
);

export default userItem;
