import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';

const CreateReviewForm = (props) => {

return (
<div className="CreateFormContainer">
<Form onSubmit={props.onConfirm}>

<Form.Row>
<Form.Group as={Col} controlId="formGridTypeSelect">
<Form.Label>Type</Form.Label>
<Form.Control as="select">
  <option>type 1</option>
  <option>type 2</option>
  <option>type 3</option>
</Form.Control>
</Form.Group>

<Form.Group as={Col} controlId="formGridTitle">
  <Form.Label>Title</Form.Label>
  <Form.Control type="text" placeholder="Title" />
</Form.Group>

</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridBody">
  <Form.Label>Body</Form.Label>
  <Form.Control as="textarea" rows="9" placeholder="Body"/>
</Form.Group>

<Form.Group as={Col} controlId="formGridRating">
  <Form.Label>Rating</Form.Label>
  <Form.Control type="number" max="5" placeholder="Rating"/>
</Form.Group>
</Form.Row>

<Form.Row>
{props.canCancel && (
  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>
)}

{props.canConfirm && (
  <Button variant="primary" className="formButton" type="submit">
  Create
  </Button>
)}
<p>{props.successText}</p>
</Form.Row>


</Form>
</div>

)};

export default CreateReviewForm;
