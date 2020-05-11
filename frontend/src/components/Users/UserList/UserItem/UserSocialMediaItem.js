import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import Image from 'react-bootstrap/Image';

import './UserItem.css';

const userSocialMediaItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail1">
    <div>

    <Card className="card">
      <Card.Body>

        <ul className="cardUl">
          <li className="cardLi">
          <p className="userItemText">
          {props.platform}
          </p>
          </li>
          <li className="cardLi">
          <p className="userItemText">
          {props.handle}
          </p>
          </li>
          <li className="cardLi">
          <p className="userItemText">
          {props.link}
          </p>
          </li>
        </ul>


        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props.socialMediaAccount)}>
            Delete
          </Button>
        )}

      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userSocialMediaItem;
