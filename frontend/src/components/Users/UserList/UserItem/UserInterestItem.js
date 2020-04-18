import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

import './UserItem.css';

const userInterestItem = props => (
  <li key={props.authId} className="users__list-item_detail2 users__list-item_detail">
    <div className="tag_card_body">

    <Card className="card">
      <Card.Body>
        <Card.Text>
          {props.interest}
        </Card.Text>


        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props.interest)}>
            Delete
          </Button>
        )}

      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userInterestItem;
