import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useParams
// } from "react-router-dom";

import './UserItem.css';

export default function lesssonItem (props) {
  
  return (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">

    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Title>{props.title}</Card.Title>
      <Card.Text>
        _id: {props._id}
      </Card.Text>
      <Card.Text>
        subtitle: {props.subtitle}
      </Card.Text>
      <Card.Text>
        public: {props.public.toString()}
      </Card.Text>
      <Card.Text>
        type: {props.type}
      </Card.Text>
      <Card.Text>
        subType: {props.subType}
      </Card.Text>
      <Card.Text>
        category: {props.category}
      </Card.Text>
      <Card.Text>
        leadInstructorId: {props.instructors[0]._id}
      </Card.Text>

      <Button variant="primary" onClick={props.onDetail.bind(this, props._id)}>
        Details
      </Button>

      {props.onSelectNoDetail && (
      <Button variant="primary" onClick={props.onSelectNoDetail.bind(this, props.lesson)}>
        Select
      </Button>
      )}
      {props.canReport === true && (
        <Button variant="danger" onClick={props.onReport.bind(this, props._id)}>
        Report
        </Button>
      )}
    </Card.Body>
    </Card>

  </li>
);
}
