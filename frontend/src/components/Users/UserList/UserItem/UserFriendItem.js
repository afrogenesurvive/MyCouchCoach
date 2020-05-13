import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userFriendItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Title>{props.username}</Card.Title>
      {props.profileImages.length !== 0 && (
      <Card.Img variant="top" src={props.profileImages[0].path} />
      )}
      <Card.Text>
        _id: {props._id}
      </Card.Text>
      <Card.Text>
        name: {props.name}
      </Card.Text>
      <Card.Text>
        username: {props.username}
      </Card.Text>
      <Card.Text>
        phone: {props.phone}
      </Card.Text>
      <Card.Text>
        email: {props.email}
      </Card.Text>
      <Card.Text>
        loggedIn: {props.loggedIn.toString()}
      </Card.Text>
      <Card.Text>
        online: {props.online.toString()}
      </Card.Text>
      {props.socialMedia.length !== 0 && (
      <Card.Text>
        SocialMedia: {props.socialMedia[0].platform} - {props.socialMedia[0].handle}
      </Card.Text>
      )}

        <Button variant="primary" onClick={props.onSelect.bind(this, props.friend)}>
          Select
        </Button>

        <Button variant="secondary" onClick={props.viewFriendDetails.bind(this, props.friend)}>
          Details
        </Button>


      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.friend)}>
          Delete
        </Button>
      )}

    </Card.Body>
    </Card>

  </li>
);

export default userFriendItem;
