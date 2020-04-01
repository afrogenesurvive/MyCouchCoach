import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userOrderItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        _id: {props._id}
      </Card.Text>
      <Card.Text>
        date: {props.orderDate}
      </Card.Text>
      <Card.Text>
        time: {props.time}
      </Card.Text>
      <Card.Text>
        type: {props.type}
      </Card.Text>
      <Card.Link href="">
      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.order)}>
          Delete
        </Button>
      )}
      </Card.Link>
    </Card.Body>
    </Card>

  </li>
);

export default userOrderItem;
