import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const lessonRequirementItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Text>
      {props.requirement}
      </Card.Text>
    </Card.Body>

    { props.canDelete === true && (
      <Button variant="danger" onClick={props.onDelete.bind(this, props.requirement)}>
        Delete
      </Button>
    )}
    </Card>

  </li>
);

export default lessonRequirementItem;
