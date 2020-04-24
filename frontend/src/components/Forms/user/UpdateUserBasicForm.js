import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import './CreateUserForm.css';

const UpdateUserBasicForm = (props) => {

  const {...user} = props.user;
  const [dob, setDob] = useState(new Date());
  const prevDob = new Date(user.dob.substr(0,9)*1000).toLocaleDateString().slice(0,10)

  const handleChangeDob = date => {
    setDob(date);
    console.log(`Dob ${dob}`);
   }

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>
<Form.Row>
  <Form.Group as={Col} controlId="formGridEmail">
    <Form.Label>Email</Form.Label>
    <Form.Control type="email" placeholder={user.contact.email}/>
  </Form.Group>

  <Form.Group as={Col} controlId="formGridPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder={user.password}/>
  </Form.Group>
</Form.Row>

<Form.Row>

<Form.Group as={Col} controlId="formGridName">
  <Form.Label>Name</Form.Label>
  <Form.Control type="text" placeholder={user.name}/>
</Form.Group>
{
  // <Form.Group as={Col} controlId="formGridRole">
  //   <Form.Label>Role</Form.Label>
  //   <Form.Control type="text" placeholder={user.role}/>
  // </Form.Group>
}
<Form.Group as={Col} controlId="formGridUsername">
  <Form.Label>Username</Form.Label>
  <Form.Control type="text" placeholder={user.username} />
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridPhone">
  <Form.Label>Phone</Form.Label>
  <Form.Control type="number" placeholder={user.contact.phone}/>
</Form.Group>
<Form.Group as={Col} controlId="formGridPhone2">
  <Form.Label>Phone2</Form.Label>
  <Form.Control type="number" placeholder={user.contact.phone2}/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridDob">
  <Form.Label>D.O.B: {prevDob}</Form.Label>
  <Form.Control type="date" placeholder={user.dob}/>
</Form.Group>

</Form.Row>


<Form.Row>
<Form.Group as={Col} controlId="formGridBio">
  <Form.Label>Bio</Form.Label>
  <Form.Control as="textarea"rows="7" placeholder={user.bio}/>
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

export default UpdateUserBasicForm;
