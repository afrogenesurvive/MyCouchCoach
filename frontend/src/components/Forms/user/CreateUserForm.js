import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';

const CreateUserForm = (props) => {

  const [dob, setDob] = useState(new Date());

  const handleChangeDob = date => {
    setDob(date);
    console.log(`Dob ${dob}`);
   }

return (
<div className="CreateFormContainer">
{props.title && (
  <h4 className="signupTitle">{props.title}</h4>
)}
<Form onSubmit={props.onConfirm}>

<Form.Row>
  <Form.Group as={Col} controlId="formGridEmail">
    <Form.Label>Email</Form.Label>
    <Form.Control type="email" placeholder="Enter email"/>
  </Form.Group>

  <Form.Group as={Col} controlId="formGridPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password"/>
  </Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridName">
  <Form.Label>Name</Form.Label>
  <Form.Control type="text" placeholder="Name" />
</Form.Group>

<Form.Group as={Col} controlId="formGridUsername">
  <Form.Label>Username</Form.Label>
  <Form.Control type="text" placeholder="Name" />
</Form.Group>

</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridPhone">
  <Form.Label>Phone</Form.Label>
  <Form.Control type="number" placeholder="phone"/>
</Form.Group>
<Form.Group as={Col} controlId="formGridPhone2">
  <Form.Label>Phone2</Form.Label>
  <Form.Control type="number" placeholder="phone2"/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridDob">
  <Form.Label>D.O.B</Form.Label>
  <Form.Control type="date" placeholder="Date of Birth"/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridPublicCheckbox">
  <Form.Label>Public ?</Form.Label>
  <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
</Form.Group>
</Form.Row>

{
  // <Form.Group as={Col} controlId="formGridRole">
  //   <Form.Label>Role</Form.Label>
  //   <Form.Control as="select">
  //   <option>guest</option>
  //   <option>nurse</option>
  //   <option>doctor</option>
  //   <option>staff</option>
  //
  //   </Form.Control>
  // </Form.Group>
  // </Form.Row>

// <Form.Row>
// <Form.Group as={Col} controlId="">
//   <Form.Label>Fancy D.O.B</Form.Label>
//   <DatePicker className="" id="staffCalendarDob"
//     selected={dob}
//     onChange={handleChangeDob}
//   />
// </Form.Group>
// </Form.Row>

// <Form.Row>
// <Form.Group as={Col} controlId="formGridEmploymentDateTodayCheckbox">
//   <Form.Label>Today ?</Form.Label>
//   <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
// </Form.Group>
// </Form.Row>
}


<Form.Row>

<Form.Group as={Col} controlId="formGridAddressType">
  <Form.Label>Type</Form.Label>
  <Form.Control as="select">
  <option>Billing</option>
  <option>Shipping</option>

  </Form.Control>
</Form.Group>

<Form.Group as={Col} controlId="formGridAddressNumber">
  <Form.Label>Street No.</Form.Label>
  <Form.Control type="number" placeholder="addressNumber"/>
</Form.Group>

<Form.Group as={Col} controlId="formGridAddressStreet">
  <Form.Label>Street Name</Form.Label>
  <Form.Control type="text" placeholder="addressStreet"/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridAddressTown">
  <Form.Label>Town</Form.Label>
  <Form.Control type="text" placeholder="addressTown"/>
</Form.Group>

<Form.Group as={Col} controlId="formGridAddressCity">
  <Form.Label>City</Form.Label>
  <Form.Control type="text" placeholder="addressCity"/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridAddressCountry">
  <Form.Label>Country</Form.Label>
  <Form.Control type="text" placeholder="addressCountry"/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridAddressPostalCode">
  <Form.Label>postalCode</Form.Label>
  <Form.Control type="text" placeholder="addresspostalCode"/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridBio">
  <Form.Label>Bio</Form.Label>
  <Form.Control as="textarea"rows="7" placeholder="Bio"/>
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

export default CreateUserForm;
