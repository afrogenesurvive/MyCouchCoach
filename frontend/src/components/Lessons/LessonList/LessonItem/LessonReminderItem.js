import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonReminderItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        ID: {props._id}
      </Card.Text>
      <Card.Text>
        createDate: {props.createDate}
      </Card.Text>
      <Card.Text>
        sendDate: {props.sendDate}
      </Card.Text>
      <Card.Text>
        Time: {props.time}
      </Card.Text>
      <Card.Text>
        Creator:
      </Card.Text>
      <Card.Text>
        ID: {props.creator._id}
      </Card.Text>
      <Card.Text>
        Username: {props.creator.username}
      </Card.Text>
      <Card.Text>
        Title: {props.title}
      </Card.Text>
      <Card.Text>
        Type: {props.type}
      </Card.Text>

      <Card.Text>
        Trigger:
      </Card.Text>
      <Card.Text>
        Unit: {props.trigger.unit}
      </Card.Text>
      <Card.Text>
        Value: {props.trigger.value}
      </Card.Text>
      <Card.Text>
        Session:
      </Card.Text>
      <Card.Text>
        Title: {props.session.title}
      </Card.Text>
      <Card.Text>
        Date: {props.sessionDate}
      </Card.Text>
      <Card.Text>
        endDate: {props.sessionEndDate}
      </Card.Text>
      <Card.Text>
        Body: {props.body}
      </Card.Text>
      <Card.Text>
        Delivery:
      </Card.Text>
      <Card.Text>
        Type: {props.delivery.type}
      </Card.Text>
      <Card.Text>
        Params: {props.delivery.params}
      </Card.Text>
      <Card.Text>
        Sent: {props.delivery.sent.toString()}
      </Card.Text>


      { props.isInstructor === true && (
        <Button variant="danger" onClick={props.deleteLessonReminder.bind(this, props._id)}>
          Delete
        </Button>
      )}
    </Card.Body>
    </Card>



  </li>
);

export default lessonReminderItem;
