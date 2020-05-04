import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonImageItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
    <Card.Img variant="top" src={props.path} />
      <Card.Text>
        Name: {props.name}
      </Card.Text>
      <Card.Text>
        Type: {props.type}
      </Card.Text>
      <Card.Text>
        Path: {props.path}
      </Card.Text>

      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.image)}>
          Delete
        </Button>
      )}
    </Card.Body>
    </Card>

  </li>
);

export default lessonImageItem;
