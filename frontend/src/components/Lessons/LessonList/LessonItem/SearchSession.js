import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

export default function searchSession (props) {
  console.log('boop', props.session);
  return (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>
    <p>here</p>
    <Card.Body>
      <Card.Title>{props.session.title}</Card.Title>
      <Card.Text>
        date: {props.session.date}
      </Card.Text>
      <Card.Text>
        time: {props.session.time}
      </Card.Text>
    </Card.Body>
    </Card>

  </li>
);
}
