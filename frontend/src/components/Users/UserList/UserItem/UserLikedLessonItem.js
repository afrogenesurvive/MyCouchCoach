import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userLikedLessonItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        Lesson:
      </Card.Text>
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
        SubType: {props.subType}
      </Card.Text>
      <Card.Text>
        Public: {props.public.toString()}
      </Card.Text>

      <Button variant="primary" onClick={props.viewLessonDetails.bind(this, {type: 'liked', lesson: props.likedLesson})}>
        Details
      </Button>
      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.likedLesson)}>
          Delete
        </Button>
      )}

    </Card.Body>
    </Card>

  </li>
);

export default userLikedLessonItem;
