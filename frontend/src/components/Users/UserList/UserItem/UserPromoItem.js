import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import './UserItem.css';

const userPerkItem = props => (
  <li key={props.authId} className="users__list-item_detail1 users__list-item_detail">
    <div>

    <Card className="card">
      <Card.Body>

        <ul className="cardUl">
          <li className="cardLi">
          <Image src={props.imageLink} className="profileImageImg" fluid />

          <p className="userItemHeading"> start/end Dates:</p>
          <p className="userItemText">
          {props.startDate}
          </p>
          <p className="userItemText">
          {props.endDate}
          </p>
          </li>
          <li>
          <p className="userItemHeading"> name:</p>
          <p className="userItemText">
          {props.name}
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
          <p className="userItemHeading"> code:</p>
          <p className="userItemText">
          {props.code}
          </p>
          </li>
        </ul>


        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props.promo)}>
            Delete
          </Button>
        )}

      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userPerkItem;
