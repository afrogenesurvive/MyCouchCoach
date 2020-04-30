import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

export default function lessonReviewItem (props) {
  let isAuthor = false;
  if (props.authId === props.author._id) {
    isAuthor = true;
  }
return (
    <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
      <Card style={{ width: '18rem' }}>

      <Card.Body>
        <Card.Text>
        ID: {props._id}
        </Card.Text>
        <Card.Text>
        Title: {props.title}
        </Card.Text>
        <Card.Text>
        Type: {props.type}
        </Card.Text>
        <Card.Text>
        isAuthor?: {isAuthor.toString()}
        </Card.Text>
        <Card.Text>
        Author: {props.type}
        </Card.Text>
        <Card.Text>
        ID: {props.author._id}
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
}
