import React from 'react';
// import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';

const CreateMessageForm = (props) => {

return (
<div className="CreateFormContainer">
<Form onSubmit={props.onConfirm}>

<Form.Row>
<Form.Group as={Col} controlId="formGridTypeSelect">
<Form.Label>Message Type</Form.Label>
<Form.Control as="select">
  <option>type 1</option>
  <option>type 2</option>
  <option>type 3</option>
</Form.Control>
</Form.Group>

{props.receiver && (<Form.Group as={Col} controlId="formGridSubject">
  <Form.Label>Subject</Form.Label>
  <Form.Control type="text" placeholder="Subject" />
</Form.Group>)}

{props.replyTo && (<Form.Group as={Col} controlId="formGridSubject">
  <Form.Label>Subject</Form.Label>
  <Form.Control type="text" value={props.replyTo.subject} />
</Form.Group>)}

{props.receiver && (<Form.Group as={Col} controlId="formGridReceiver">
  <Form.Label>Receiver: {props.receiver.username}</Form.Label>
</Form.Group>)}

{props.replyTo && (<Form.Group as={Col} controlId="formGridReceiver">
  <Form.Label>replyTo: {props.replyTo.sender.username}</Form.Label>
</Form.Group>)}

</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridMessage">
  <Form.Label>Message</Form.Label>
  <Form.Control as="textarea" rows="9" placeholder="Message"/>
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

export default CreateMessageForm;
