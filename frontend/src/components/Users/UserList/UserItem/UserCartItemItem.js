import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userCartItemItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        dateAdded: {props.cartItemDateAdded}
      </Card.Text>
      <Card.Text>
        sessionDate: {props.cartItemSessionDate}
      </Card.Text>
      <Card.Text>
        Lesson:
      </Card.Text>
      <Card.Text>
        ID: {props.lesson._id}
      </Card.Text>

      <Card.Link href="">
      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.cartItem)}>
          Delete
        </Button>
      )}
      </Card.Link>
    </Card.Body>
    </Card>

  </li>
);

export default userCartItemItem;
