import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';

const AddUserPaymentInfoForm = (props) => {

  const [payInfoDate, setPayInfoDate] = useState(new Date());
  const handleChangePayInfoDate = date => {
    setPayInfoDate(date);
    console.log(`PayInfoDate ${payInfoDate}`);
   }

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

  <Form.Row>

  <Form.Group as={Col} controlId="">
    <Form.Label>Date</Form.Label>
    <DatePicker className="" id="paymentInfoDate"
      selected={payInfoDate}
      onChange={handleChangePayInfoDate}
    />
  </Form.Group>

  <Form.Group as={Col} controlId="formGridPaymentInfoType">
    <Form.Label>Type</Form.Label>
    <Form.Control as="select">
    <option>type a</option>
    <option>type 2</option>
    <option>type 42</option>
    </Form.Control>
  </Form.Group>
  </Form.Row>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridDescription">
    <Form.Label>Description</Form.Label>
    <Form.Control as="textarea" rows="5" placeholder="Description"/>
  </Form.Group>
  </Form.Row>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridBody">
    <Form.Label>Body</Form.Label>
    <Form.Control as="textarea" rows="7" placeholder="Body"/>
  </Form.Group>
  </Form.Row>

  {
  // <Form.Row>
  // <Form.Group as={Col} controlId="formGridPaymentInfoPrimaryCheckbox">
  //   <Form.Label>Primary</Form.Label>
  //   <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
  // </Form.Group>
  // </Form.Row>
}

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

export default AddUserPaymentInfoForm;
