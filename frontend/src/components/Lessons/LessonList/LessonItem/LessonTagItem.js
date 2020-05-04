import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonTagItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
      {props.tag}
      </Card.Text>
    </Card.Body>

    { props.canDelete === true && (
      <Button variant="danger" onClick={props.onDelete.bind(this, props.tag)}>
        Delete
      </Button>
    )}
    </Card>

  </li>
);

export default lessonTagItem;
