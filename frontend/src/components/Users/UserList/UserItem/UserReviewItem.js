import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userReviewItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        ID: {props._id}
      </Card.Text>
      <Card.Text>
        Lesson:
      </Card.Text>
      <Card.Text>
        ID: {props.lesson._id}
      </Card.Text>
      <Card.Text>
        Title: {props.lesson.title}
      </Card.Text>
      <Card.Text>
        Date: {props.date}
      </Card.Text>
      <Card.Text>
        Type: {props.type}
      </Card.Text>
      <Card.Text>
        Body: {props.body}
      </Card.Text>
      <Card.Text>
        Rating: {props.rating}
      </Card.Text>

    </Card.Body>
    </Card>

  </li>
);

export default userReviewItem;
