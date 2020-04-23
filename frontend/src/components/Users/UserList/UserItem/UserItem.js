import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import './UserItem.css';

export default function userItem (props) {
  return (
    <Router>
    <li key={props.authId} className="users__list-item_detail users__list-item_detail4">
      <Card style={{ width: '18rem' }}>

      <Card.Body>
        <Card.Text>
          ID: {props._id}
        </Card.Text>
        <Card.Text>
          username: {props.username}
        </Card.Text>
        <Card.Text>
          role: {props.role}
        </Card.Text>
        <Link to={'users/'+props.user.username+''}>
          <Button variant="primary" onClick={props.onDetail.bind(this, props._id)}>
            Details
          </Button>
        </Link>

          <Button variant="secondary" onClick={props.onSelectNoDetail.bind(this, props.user)}>
          Select
        </Button>


      </Card.Body>
      </Card>

    </li>
    <Switch>
      <Route path="users/:id" children={<Child />} />
    </Switch>
    </Router>
  )
};

function Child() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();

  return (
    id
  );
}
