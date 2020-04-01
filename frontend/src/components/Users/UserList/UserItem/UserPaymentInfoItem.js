import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import './UserItem.css';

const userPaymentInfoItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail1">
    <div>

    <Card className="card">
      <Card.Body>

      <Card.Text>
        date: {props.paymentInfoItemDate}
      </Card.Text>
      <Card.Text>
        type: {props.type}
      </Card.Text>
      <Card.Text>
        description: {props.description}
      </Card.Text>
      <Card.Text>
        body: {props.body}
      </Card.Text>
      <Card.Text>
        primary: {props.primary}
      </Card.Text>
      <Card.Text>
        valid: {props.valid}
      </Card.Text>

      <Card.Link href="">
      { props.canDelete === true && (
        <Button variant="danger" onClick={props.onDelete.bind(this, props.paymentInfo)}>
          Delete
        </Button>
      )}
      </Card.Link>
      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userPaymentInfoItem;
