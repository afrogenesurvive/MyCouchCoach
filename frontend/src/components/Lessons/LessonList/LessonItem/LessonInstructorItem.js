import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonInstructorItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Img variant="top" src={props.profileImages[0].path} />
      <Card.Text>
      ID: {props._id}
      </Card.Text>
      <Card.Text>
      username: {props.username}
      </Card.Text>
      <Card.Text>
      socialMedia
      </Card.Text>
      <Card.Text>
      {props.socialMedia[0].platform} @ {props.socialMedia[0].handle}
      </Card.Text>
      <Card.Text>
      Email: {props.contact.email}
      </Card.Text>
    </Card.Body>
    </Card>

  </li>
);

export default lessonInstructorItem;
