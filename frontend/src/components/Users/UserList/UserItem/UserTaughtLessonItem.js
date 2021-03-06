import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userTaughtLessonItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        date: {props.date}
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
        Type: {props.lesson.type}
      </Card.Text>
      <Card.Text>
        SubType: {props.lesson.subType}
      </Card.Text>
      <Card.Text>
        Public: {props.lesson.public.toString()}
      </Card.Text>

      <Button variant="primary" onClick={props.viewLessonDetails.bind(this, {type: 'taught', lesson: props.taughtLesson})}>
        View Details
      </Button>
      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.taughtLesson)}>
          Delete
        </Button>
      )}

    </Card.Body>
    </Card>

  </li>
);

export default userTaughtLessonItem;
