import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

import './UserItem.css';

const userComplaintItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail3">
    <div>

    <Card className="card">
      <Card.Body>
        <Card.Title>
          Complaint
        </Card.Title>


        <ul className="cardUl">
          <li className="cardLi">
          <p className="userItemHeading"> date:</p>
          <p className="userItemText">
          {props.date}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> type:</p>
          <p className="userItemText">
          {props.type}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> description:</p>
          <p className="userItemText">
          {props.description}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> complainantId:</p>
          <p className="userItemText">
          {props.complainant._id}
          </p>
          </li>
        </ul>

        <Card.Link href="">
        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props.complaint)}>
            Delete
          </Button>
        )}
        </Card.Link>
      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userComplaintItem;
