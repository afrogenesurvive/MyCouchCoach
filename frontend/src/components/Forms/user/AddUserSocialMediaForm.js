import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const AddUserSocialMediForm = (props) => {

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridPlatform">
    <Form.Label>Platform</Form.Label>
    <Form.Control type="text" placeholder="Platform"/>
  </Form.Group>
  </Form.Row>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridHandle">
    <Form.Label>Handle</Form.Label>
    <Form.Control type="text" placeholder="Handle"/>
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

export default AddUserSocialMediForm;
