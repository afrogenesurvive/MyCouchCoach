import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './CreateUserForm.css';

const SearchLessonSessionForm = (props) => {

return (
<div className="SearchFormContainer">
  <Form onSubmit={props.onConfirm}>

  <Form.Row>
  <Form.Label>Lesson: {props.lesson._id}</Form.Label>

  <Form.Group className="searchInput" controlId="formGridSessionDate">
  <Form.Label>SessionDate</Form.Label>
  <Form.Control type="text" placeholder="SessionDate"/>
  </Form.Group>

  <Form.Group className="searchInput" controlId="formGridSessionTitle">
  <Form.Label>SessionTitle</Form.Label>
  <Form.Control type="text" placeholder="SessionTitle"/>
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

export default SearchLessonSessionForm;
