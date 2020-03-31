import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import './UserItem.css';

const userProfileImageItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail1">
    <div>

    <Card className="card">
      <Card.Body>

        <ul className="cardUl">
          <li>
          <Image src={props.path} className="profileImageImg" fluid />

          </li>
          <li className="cardLi">
          <p className="userItemText">
          {props.name}
          </p>
          </li>
        </ul>

        <Card.Link href="">
        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props.profileImage)}>
            Delete
          </Button>
        )}
        </Card.Link>
      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userProfileImageItem;
