import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const AddLessonInstructorForm = (props) => {
// const {...user} = props.user;
console.log('props.selectedInstructor',props.selectedInstructor.role);
return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

{props.selectedInstructor.role !== 'Instructor' && (
<Form.Row>
  <Form.Group as={Col} controlId="">
  <Form.Label> {props.selectedInstructor.username} is not an Instructor! </Form.Label>
</Form.Group>
</Form.Row>
)}
{props.selectedInstructor.role === 'Instructor' && (
<Form.Row>
  <Form.Group as={Col} controlId="">
  <Form.Label>Add Instructor: {props.selectedInstructor.username} to this lesson...?</Form.Label>
</Form.Group>
</Form.Row>
)}
<Form.Row>

{props.selectedInstructor.role === 'Instructor' && (
  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>
)}
{props.selectedInstructor.role === 'Instructor' && (
  <Button variant="primary" className="formButton" type="submit">
  Submit
  </Button>
)}
</Form.Row>

</Form>
</div>

)};

export default AddLessonInstructorForm;
