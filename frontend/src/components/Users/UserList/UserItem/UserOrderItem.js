import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import UserOrderLessonList from '../UserOrderLessonList';

import './UserItem.css';

const userOrderItem = props => (

  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        ID: {props._id}
      </Card.Text>
      <Card.Text>
        Date: {props.date},  time: {props.time}
      </Card.Text>
      <Card.Text>
        Type: {props.type}
      </Card.Text>
      <Card.Text>
        Total: {props.totals.a}
      </Card.Text>
      <Card.Text>
        Status:
      </Card.Text>
      <Card.Text>
        cancelled: {props.status.cancelled.value.toString()}, Date: {props.status.cancelled.date}
      </Card.Text>
      <Card.Text>
        checkedOut: {props.status.checkedOut.value.toString()}, Date: {props.status.checkedOut.date}
      </Card.Text>
      <Card.Text>
        confirmed: {props.status.confirmed.value.toString()}, Date: {props.status.confirmed.date}
      </Card.Text>
      <Card.Text>
        confirmedDelivery: {props.status.confirmedDelivery.value.toString()}, Date: {props.status.confirmedDelivery.date}
      </Card.Text>
      <Card.Text>
        delivered: {props.status.delivered.value.toString()}, Date: {props.status.delivered.date}
      </Card.Text>
      <Card.Text>
        emailSent: {props.status.emailSent.value.toString()}, Date: {props.status.emailSent.date}
      </Card.Text>
      <Card.Text>
        held: {props.status.held.value.toString()}, Date: {props.status.held.date}
      </Card.Text>
      <Card.Text>
        packaged: {props.status.packaged.value.toString()}, Date: {props.status.packaged.date}
      </Card.Text>
      <Card.Text>
        paid: {props.status.paid.value.toString()}, Date: {props.status.paid.date}
      </Card.Text>
      <Card.Text>
        shipped: {props.status.shipped.value.toString()}, Date: {props.status.shipped.date}
      </Card.Text>

      <Card.Text>
        Sessions:
      </Card.Text>
      <UserOrderLessonList
        authId={props.authId}
        userOrderLessons={props.lessons}
      />


      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.order)}>
          Delete
        </Button>
      )}

    </Card.Body>
    </Card>

  </li>
);

export default userOrderItem;
