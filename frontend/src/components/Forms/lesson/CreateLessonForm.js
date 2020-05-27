import React from 'react';
// import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
// import Accordion from 'react-bootstrap/Accordion';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';


const CreateLessonForm = (props) => {

return (
<div className="CreateFormContainer">
{props.title && (
  <h4 className="signupTitle">{props.title}</h4>
)}
<Form onSubmit={props.onConfirm}>

<Form.Row>
  <Form.Group as={Col} controlId="formGridTitle">
    <Form.Label>Title</Form.Label>
    <Form.Control type="text" placeholder="Enter Title"/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridSubtitle">
    <Form.Label>Subtitle</Form.Label>
    <Form.Control type="text" placeholder="Enter Subtitle"/>
  </Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridDuration">
  <Form.Label>Duration</Form.Label>
  <Form.Control type="text" placeholder="Enter Duration"/>
</Form.Group>

<Form.Group as={Col} controlId="formGridPublic">
  <Form.Label>Public</Form.Label>
  <Form.Control as="select">
  <option>true</option>
  <option>false</option>
  </Form.Control>
</Form.Group>

<Form.Group as={Col} controlId="formGridType">
  <Form.Label>Type</Form.Label>
  <Form.Control as="select">
  <option>OneTime</option>
  <option>Recurring</option>
  </Form.Control>
</Form.Group>

<Form.Group as={Col} controlId="formGridSubType">
  <Form.Label>SubType</Form.Label>
  <Form.Control as="select">
  <option>OneDay</option>
  <option>MultiDay</option>
  </Form.Control>
</Form.Group>

<Form.Group as={Col} controlId="formGridCategory">
  <Form.Label>Category</Form.Label>
  <Form.Control as="select">
  <option>a_b_c_d</option>
  <option>a_b_c_x</option>
  <option>a_b_z</option>
  <option>a_b_c_y</option>
  </Form.Control>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridSku">
  <Form.Label>Sku</Form.Label>
  <Form.Control type="text" placeholder="Sku" />
</Form.Group>

<Form.Group as={Col} controlId="formGridPrice">
  <Form.Label>Price</Form.Label>
  <Form.Control type="number" step='0.01' placeholder="Price" />
</Form.Group>

<Form.Group as={Col} controlId="formGridPoints">
  <Form.Label>Points</Form.Label>
  <Form.Control type="number" placeholder="Points" />
</Form.Group>

</Form.Row>


<Form.Row>
<Form.Group as={Col} controlId="formGridDescription">
  <Form.Label>Description</Form.Label>
  <Form.Control as="textarea"rows="7" placeholder="Description"/>
</Form.Group>
</Form.Row>
<Form.Row>
<Form.Group as={Col} controlId="formGridNotes">
  <Form.Label>Notes</Form.Label>
  <Form.Control as="textarea"rows="5" placeholder="Notes"/>
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

export default CreateLessonForm;
