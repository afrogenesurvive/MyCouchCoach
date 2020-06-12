import React from 'react';
// import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';

const AddReminderForm = (props) => {

return (
<div className="CreateFormContainer">
<Form onSubmit={props.onConfirm}>

<Form.Row>
<Form.Group as={Col} controlId="formGridTypeSelect">
<Form.Label>Type</Form.Label>
<Form.Control as="select">
  <option>Reminder</option>
  <option>FollowUp</option>
</Form.Control>
</Form.Group>

<Form.Group as={Col} controlId="formGridTitle">
  <Form.Label>Title</Form.Label>
  <Form.Control type="text" placeholder="Title"/>
</Form.Group>
</Form.Row>

<Form.Row>
<h4>Trigger:</h4>
<Form.Group as={Col} controlId="formGridTriggerUnitSelect">
<Form.Label>Unit</Form.Label>
<Form.Control as="select">
  <option>Weeks</option>
  <option>Days</option>
  <option>Hours</option>
  <option>Minutes</option>
</Form.Control>
</Form.Group>

<Form.Group as={Col} controlId="formGridTriggerValue">
  <Form.Label>Value</Form.Label>
  <Form.Control type="number"/>
</Form.Group>

</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridBody">
  <Form.Label>Body</Form.Label>
  <Form.Control as="textarea" rows="5" placeholder="Reminder Message"/>
</Form.Group>
</Form.Row>

<Form.Row>
  <h4>Delivery:</h4>
  <Form.Group as={Col} controlId="formGridDeliveryTypeSelect">
  <Form.Label>Type</Form.Label>
  <Form.Control as="select">
    <option>Email</option>
    <option>SMS</option>
    <option>CouchCoachMSG</option>
    <option>All</option>
  </Form.Control>
  </Form.Group>

  <Form.Group as={Col} controlId="formGridDeliveryParams">
    <Form.Label>Parameters</Form.Label>
    <Form.Control type="text" placeholder="Delivery Params"/>
  </Form.Group>
</Form.Row>

<Form.Row>

  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>



  <Button variant="primary" className="formButton" type="submit">
  Add
  </Button>


</Form.Row>


</Form>
</div>

)};

export default AddReminderForm;
