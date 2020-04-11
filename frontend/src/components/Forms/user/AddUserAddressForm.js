import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const AddUserAddressForm = (props) => {

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

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

export default AddUserAddressForm;
