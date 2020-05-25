import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userBookedLessonItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        dateBooked: {props.dateBooked}
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
        Session:
      </Card.Text>
      <Card.Text>
        Title: {props.sessionTitle}
      </Card.Text>
      <Card.Text>
        Date: {props.sessionDate}
      </Card.Text>
      <Card.Text>
        Time: {props.sessionTime}
      </Card.Text>

      <Button variant="primary" onClick={props.viewLessonDetails.bind(this, {type: 'booked', lesson: props.bookedLesson})}>
        View Details
      </Button>

      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.bookedLesson)}>
          Delete
        </Button>

      )}

    </Card.Body>
    </Card>

  </li>
);

export default userBookedLessonItem;
