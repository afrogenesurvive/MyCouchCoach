import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const AddUserBillingForm = (props) => {

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

<Form.Group as={Col} controlId="formGridTypeSelect">
<Form.Label>Billing Types</Form.Label>
<Form.Control as="select">
  <option>type 1</option>
  <option>type 2</option>
  <option>type 3</option>
</Form.Control>
</Form.Group>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridDescription">
    <Form.Label>Billing Description</Form.Label>
    <Form.Control as="textarea" rows="12" placeholder="Billing description"/>
  </Form.Group>
  </Form.Row>
  <Form.Row>
    <Form.Group as={Col} controlId="formGridAmount">
    <Form.Label>Billing Amount</Form.Label>
    <Form.Control type="number" step="0.01" placeholder="Billing Amount"/>
  </Form.Group>
  </Form.Row>
  <Form.Row>
    <Form.Group as={Col} controlId="formGridPayment">
    <Form.Label>Billing Payment</Form.Label>
    <Form.Control as="textarea" rows="9" placeholder="Billing Payment"/>
  </Form.Group>

  <Form.Group as={Col} controlId="formGridPaidCheckbox">
    <Form.Label>Paid ?</Form.Label>
    <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
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

export default AddUserBillingForm;
