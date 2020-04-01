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
        name: {props.name}
      </Card.Text>
      <Card.Text>
        username: {props.username}
      </Card.Text>
      <Card.Text>
        phone: {props.contact.phone}
      </Card.Text>
      <Card.Text>
        email: {props.contact.email}
      </Card.Text>
      <Card.Text>
        Bio: {props.bio}
      </Card.Text>
      <Card.Text>
        points: {props.points}
      </Card.Text>
      <Card.Text>
        Interests: {props.interests[1]}, {props.interests[2]}, {props.interests[3]}
      </Card.Text>

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
