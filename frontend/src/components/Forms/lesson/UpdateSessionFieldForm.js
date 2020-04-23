import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';


const UpdateSessionFieldForm = (props) => {
return (
<div className="CreateFormContainer">
<Form onSubmit={props.onConfirm}>

{
//   <Form.Row>
// <Form.Group as={Col} controlId="formGridSessionTitle">
//   <Form.Label>SessionTitle</Form.Label>
//   <Form.Control type="text" placeholder='session title' />
// </Form.Group>
// <Form.Group as={Col} controlId="formGridQuery">
//   <Form.Label>Query</Form.Label>
//   <Form.Control type="text" placeholder='query' />
// </Form.Group>
// </Form.Row>

}
<Form.Row>
  <Form.Group as={Col} controlId="formGridFieldSelect">
    <Form.Label>Field: </Form.Label>
    <Form.Control as="select">
    <option>url</option>
    <option>time</option>
    <option>limit</option>
    </Form.Control>
  </Form.Group>

  <Form.Group as={Col} controlId="formGridQuery">
    <Form.Label>Query</Form.Label>
    <Form.Control type="text" placeholder='query' />
  </Form.Group>
</Form.Row>



<Form.Row>
  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>

  <Button variant="primary" className="formButton" type="submit">
  Edit
  </Button>
</Form.Row>


</Form>
</div>

)};

export default UpdateSessionFieldForm;
