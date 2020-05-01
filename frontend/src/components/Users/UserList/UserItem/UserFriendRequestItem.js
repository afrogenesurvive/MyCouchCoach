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
        Sender: {props.sender.username}
      </Card.Text>
      <Card.Text>
        Receiver: {props.receiver.username}
      </Card.Text>

        {props.received && (
          <Button variant="primary" onClick={props.onAccept.bind(this, props.friendRequest)}>
          Accept
          </Button>
        )}
        {props.received && (
          <Button variant="danger" onClick={props.onReject.bind(this, props.friendRequest)}>
            Reject
          </Button>
        )}

    </Card.Body>
    </Card>

  </li>
);

export default userFriendRequestItem;
