import React from 'react';
// import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import './UserItem.css';

const searchLessonItem = props => (
  <li key={props.authId} className="users__list-item_master">
    <div>
      <p className="userItemHeading"> ID:</p>
      <p className="userItemText">
        {props._id}
      </p>
      <p className="userItemHeading"> Title:</p>
      <p className="userItemText">
        {props.title}
      </p>
      <p className="userItemHeading"> Category:</p>
      <p className="userItemText">
        {props.category}
      </p>
    </div>
    <div>
    <Button variant="primary" onClick={props.onDetail.bind(this, props._id)}>
          Details
        </Button>
        <Button variant="primary" onClick={props.onSelectNoDetail.bind(this, props.lesson)}>
          Select
        </Button>
    </div>
  </li>
);

export default searchLessonItem;
