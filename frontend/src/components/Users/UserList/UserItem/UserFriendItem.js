import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userFriendItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Title>{props.username}</Card.Title>
      <Card.Img variant="top" src={props.profileImages[0].path} />
      <Card.Text>
        _id: {props._id}
      </Card.Text>
      <Card.Text>
        username: {props.username}
      </Card.Text>
      <Card.Text>
        loggedIn: {props.loggedIn.toString()}
      </Card.Text>
      <Card.Text>
        online: {props.online.toString()}
      </Card.Text>

      <Card.Link href="">
        <Button variant="primary" onClick={props.onSelect.bind(this, props.friend)}>
          Select
        </Button>
      </Card.Link>
      <Card.Link href="">
      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.friend)}>
          Delete
        </Button>
      )}
      </Card.Link>
    </Card.Body>
    </Card>

  </li>
);

export default userFriendItem;
