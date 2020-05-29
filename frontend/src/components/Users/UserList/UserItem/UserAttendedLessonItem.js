import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

export default function userAttendedLessonItem (props) {
  return (
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

      <Button variant="primary" onClick={props.viewLessonDetails.bind(this, {type: 'attended', lesson: props.attendedLesson})}>
        View Details
      </Button>
      {props.hasReviewed !== true && (<Button variant="primary" onClick={props.startCreateReview.bind(this, props.attendedLesson)}>
        Review
      </Button>)}
      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.attendedLesson)}>
          Delete
        </Button>
      )}

    </Card.Body>
    </Card>

  </li>
);

}
