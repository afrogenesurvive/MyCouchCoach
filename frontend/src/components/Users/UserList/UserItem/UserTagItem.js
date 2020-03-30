import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

import './UserItem.css';

const userTagItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail2">
    <div>

    <Card className="card">
      <Card.Body>
        <Card.Text>
          {props.tag}
        </Card.Text>

        <Card.Link href="">
        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props.tag)}>
            Delete
          </Button>
        )}
        </Card.Link>
      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userTagItem;
