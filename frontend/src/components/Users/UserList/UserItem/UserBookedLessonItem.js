import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userBookedLessonItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        date: {props.bookedLessonDate}
      </Card.Text>
      <Card.Text>
        Lesson:
      </Card.Text>
      <Card.Text>
        ID: {props.ref._id}
      </Card.Text>
      <Card.Text>
        Title: {props.ref.title}
      </Card.Text>

      <Card.Link href="">
      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.bookedLesson)}>
          Delete
        </Button>
      )}
      </Card.Link>
    </Card.Body>
    </Card>

  </li>
);

export default userBookedLessonItem;
