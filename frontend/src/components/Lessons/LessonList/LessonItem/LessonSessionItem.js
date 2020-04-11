import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonSessionItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Title>{props.title}</Card.Title>
      <Card.Text>
        date: {props.date}
      </Card.Text>
    </Card.Body>

    <Button variant="primary" onClick={props.onBookSession.bind(this, props.session)}>
          Book
        </Button>
    <Button variant="secondary" onClick={props.onAddCartLesson.bind(this, props.session)}>
          Cart
        </Button>
    </Card>

  </li>
);

export default lessonSessionItem;
