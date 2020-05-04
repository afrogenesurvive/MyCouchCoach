import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const AddLessonRequirementsForm = (props) => {
// const {...user} = props.user;

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

<Form.Row>
  <Form.Group as={Col} controlId="formGridRequirements">
  <Form.Label>Requirements</Form.Label>
  <Form.Control as="textarea" rows="9" placeholder="requirement, requirement, requirement"/>
</Form.Group>
</Form.Row>

<Form.Row>

  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>

  <Button variant="primary" className="formButton" type="submit">
  Submit
  </Button>

</Form.Row>

</Form>
</div>

)};

export default AddLessonRequirementsForm;
