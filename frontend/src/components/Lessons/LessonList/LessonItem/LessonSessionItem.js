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
      <Card.Text>
        time: {props.time}
      </Card.Text>
      <Card.Text>
        full: {props.full}
      </Card.Text>
      <Card.Text>
        limit: {props.limit}
      </Card.Text>
      <Card.Text>
        amount: {props.amount}
      </Card.Text>
      <Card.Text>
        url: {props.url}
      </Card.Text>
      <Card.Text>
        bookedAmount: {props.bookedAmount}
      </Card.Text>
      <Card.Text>
        attendedAmount: {props.attendedAmount}
      </Card.Text>
    </Card.Body>

    {props.onBookSession && (<Button variant="primary" onClick={props.onBookSession.bind(this, props.session)}>
          Book
        </Button>)}
    {props.onAddCartLesson && (<Button variant="secondary" onClick={props.onAddCartLesson.bind(this, props.session)}>
          Cart
        </Button>)}
    </Card>

  </li>
);

export default lessonSessionItem;
