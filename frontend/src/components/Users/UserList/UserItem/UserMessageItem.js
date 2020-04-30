import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

import './UserItem.css';

const userMessgeItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail2">
    <div>

    <Card className="card">
      <Card.Body>
        <Card.Title>
          Message
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
          {props.sender._id}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> receiver:</p>
          <p className="userItemText">
          {props.receiver._id}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> time:</p>
          <p className="userItemText">
          {props.time}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> type:</p>
          <p className="userItemText">
          {props.type}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> subject:</p>
          <p className="userItemText">
          {props.subject}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> message:</p>
          <p className="userItemText">
          {props.messageMessage}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> read:</p>
          <p className="userItemText">
          {props.read.toString()}
          </p>
          </li>
        </ul>


        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props._id)}>
            Delete
          </Button>
        )}

      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userMessgeItem;
