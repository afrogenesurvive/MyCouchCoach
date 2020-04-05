import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userFriendRequestItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
        date: {props.date}
      </Card.Text>
      <Card.Text>
        Sender: {props.sender._id}, {props.sender.username}
      </Card.Text>
      <Card.Text>
        Receiver: {props.receiver._id}, {props.receiver.username}
      </Card.Text>

      <Card.Link href="">
        <Button variant="primary" onClick={props.onSelect.bind(this, props.friendRequest)}>
          Select
        </Button>
        <Card.Link href="">
        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props.friendRequest)}>
            Delete
          </Button>
        )}
        </Card.Link>
      </Card.Link>
    </Card.Body>
    </Card>

  </li>
);

export default userFriendRequestItem;
