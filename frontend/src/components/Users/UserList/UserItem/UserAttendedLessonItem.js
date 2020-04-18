import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userAttendedLessonItem = props => (
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

      <Button variant="primary" onClick={props.viewLessonDetails.bind(this, props.lesson)}>
        View Details
      </Button>
      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.attendedLesson)}>
          Delete
        </Button>
      )}

    </Card.Body>
    </Card>

  </li>
);

export default userAttendedLessonItem;
