import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const AddUserComplaintForm = (props) => {

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

<Form.Row>
<Form.Group as={Col} controlId="formGridTypeSelect">
<Form.Label>Complaint Types</Form.Label>
<Form.Control as="select">
  <option>type 1</option>
  <option>type 2</option>
  <option>type 3</option>
</Form.Control>
</Form.Group>

<h5>Offender Username:</h5>
  {props.selectedUser.username}

</Form.Row>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridDescription">
    <Form.Label>Complaint Description</Form.Label>
    <Form.Control as="textarea" rows="12" placeholder="Complaint description"/>
  </Form.Group>
  </Form.Row>

<Form.Row>
{props.canCancel && (
  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>
)}
{props.canCancelProfile && (
  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>
)}

{props.canConfirm && (
  <Button variant="primary" className="formButton" type="submit">
  Submit
  </Button>
)}
</Form.Row>

</Form>
</div>

)};

export default AddUserComplaintForm;
