import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './UserItem.css';

const userItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
    <Card style={{ width: '18rem' }}>

    <Card.Body>
      <Card.Title>{props.title}</Card.Title>
      <Card.Img variant="top" src={props.gallery[0].path} />
      <Card.Text>
        _id: {props._id}
      </Card.Text>
      <Card.Text>
        subtitle: {props.subtitle}
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
      {props.canReport === true && (
        <Button variant="danger" onClick={props.onReport.bind(this, props._id)}>
        Report
        </Button>
      )}
    </Card.Body>
    </Card>

  </li>
);

export default userItem;
