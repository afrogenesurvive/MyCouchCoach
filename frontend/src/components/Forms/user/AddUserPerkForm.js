import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const AddUserPerkForm = (props) => {

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridName">
    <Form.Label>Name:</Form.Label>
    <Form.Control type="text" placeholder="Perk name"/>
  </Form.Group>
  </Form.Row>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridDescription">
    <Form.Label>Description:</Form.Label>
    <Form.Control as="textarea" rows="7" placeholder="Perk description"/>
  </Form.Group>
  </Form.Row>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridImageLink">
    <Form.Label>ImageLink</Form.Label>
    <Form.Control type="text" placeholder="Image Path"/>
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

export default AddUserPerkForm;
