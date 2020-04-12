import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';


const UpdateLessonBasicForm = (props) => {
const {...lesson} = props.lesson;
return (
<div className="CreateFormContainer">
<Form onSubmit={props.onConfirm}>

<Form.Row>
  <Form.Group as={Col} controlId="formGridTitle">
    <Form.Label>Title</Form.Label>
    <Form.Control type="text" placeholder={lesson.title}/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridSubtitle">
    <Form.Label>Subtitle</Form.Label>
    <Form.Control type="text" placeholder={lesson.subtitle}/>
  </Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridDuration">
  <Form.Label>Duration</Form.Label>
  <Form.Control type="text" placeholder={lesson.duration}/>
</Form.Group>
<Form.Group as={Col} controlId="formGridType">
  <Form.Label>Type: {lesson.type}</Form.Label>
  <Form.Control as="select">
  <option>type a</option>
  <option>type b</option>
  </Form.Control>
</Form.Group>

<Form.Group as={Col} controlId="formGridCategory">
  <Form.Label>Category: {lesson.category}</Form.Label>
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
  <Form.Control type="text" placeholder={lesson.sku} />
</Form.Group>

<Form.Group as={Col} controlId="formGridPrice">
  <Form.Label>Price</Form.Label>
  <Form.Control type="number" step='0.01' placeholder={lesson.price} />
</Form.Group>

<Form.Group as={Col} controlId="formGridPoints">
  <Form.Label>Points</Form.Label>
  <Form.Control type="number" placeholder={lesson.points} />
</Form.Group>

</Form.Row>


<Form.Row>
<Form.Group as={Col} controlId="formGridDescription">
  <Form.Label>Description</Form.Label>
  <Form.Control as="textarea"rows="7" placeholder={lesson.description}/>
</Form.Group>
</Form.Row>
<Form.Row>
<Form.Group as={Col} controlId="formGridNotes">
  <Form.Label>Notes</Form.Label>
  <Form.Control as="textarea"rows="5" placeholder={lesson.notes}/>
</Form.Group>
</Form.Row>

<Form.Row>
  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>

  <Button variant="primary" className="formButton" type="submit">
  Create
  </Button>
</Form.Row>


</Form>
</div>

)};

export default UpdateLessonBasicForm;
