import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonInstructorItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      {props.profileImages &&
        props.profileImages.length > 0 && (
        <Card.Img variant="top" src={props.profileImages[0].path} />
      )}
      <Card.Text>
      ID: {props._id}
      </Card.Text>
      <Card.Text>
      username: {props.username}
      </Card.Text>
      <Card.Text>
      socialMedia
      </Card.Text>
      {props.socialMedia &&
        props.socialMedia.length > 0 && (
        <Card.Text>
          {props.socialMedia[0].platform} @ {props.socialMedia[0].handle}
        </Card.Text>
      )}
      <Card.Text>
      Email: {props.contact.email}
      </Card.Text>

      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.instructor)}>
          Delete
        </Button>
      )}
    </Card.Body>
    </Card>

  </li>
);

export default lessonInstructorItem;
