import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

import './UserItem.css';

const userTransactionItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail2">
    <div>

    <Card className="card">
      <Card.Body>
        <Card.Title>
          Transaction
        </Card.Title>

        <ul className="cardUl">
          <li className="cardLi">
          <p className="userItemHeading"> date:</p>
          <p className="userItemText">
          {props.date}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> sender:</p>
          <p className="userItemText">
          {props.sender.role}: {props.sender.ref}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> senderName:</p>
          <p className="userItemText">
          {props.sender.username}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> receiver:</p>
          <p className="userItemText">
          {props.receiver.role}: {props.receiver.ref}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> receiverName:</p>
          <p className="userItemText">
          {props.receiver.username}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> time:</p>
          <p className="userItemText">
          {props.time}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> amount:</p>
          <p className="userItemText">
          {props.amount}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> description:</p>
          <p className="userItemText">
          {props.description}
          </p>
          </li>
        </ul>

        <Card.Link href="">
        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props._id)}>
            Delete
          </Button>
        )}
        </Card.Link>
      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userTransactionItem;
