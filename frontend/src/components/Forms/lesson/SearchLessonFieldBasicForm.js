import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './CreateUserForm.css';

const SearchLessonFieldBasicForm = (props) => {

return (
<div className="SearchFormContainer">
  <Form onSubmit={props.onConfirm}>

  <Form.Row>
  <Form.Group className="searchInput" controlId="formBasicFieldSelect">
  <Form.Label>Basic Field</Form.Label>
  <Form.Control as="select">
  <option>select</option>
  <option>price</option>
  <option>points</option>
  <option>schedule.date</option>
  <option>schedule.time</option>
  <option>instructors</option>
  <option>attendees</option>
  <option>sessions.booked</option>
  <option>sessions.attended</option>
  <option>sessions.bookedAmount</option>
  <option>sessions.attendedAmount</option>
  <option>sessions.date</option>
  <option>sessions.full</option>
  <option>sessions.inProgress</option>
  <option>sessions.limit</option>
  <option>sessions.amount</option>
  </Form.Control>
  <Form.Text className="text-muted">
  </Form.Text>
  </Form.Group>

  <Form.Group className="searchInput" controlId="formBasicQuery">
  <Form.Label>Basic Query</Form.Label>
  <Form.Control type="textarea" rows="5" placeholder="Query"/>
  </Form.Group>

  {props.canCancel && (
    <Button variant="danger" className="searchFormBtn" onClick={props.onCancel}>Cancel</Button>
  )}

  {props.canConfirm && (
    <Button variant="primary" className="searchFormBtn" type="submit">
    Submit
    </Button>
  )}
  </Form.Row>



</Form>
</div>


)};

export default SearchLessonFieldBasicForm;
