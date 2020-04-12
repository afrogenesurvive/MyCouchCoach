import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';

import UserAddressList from '../../Users/UserList/UserAddressList';

const CreateOrderForm = (props) => {
  const {...user} = props.user;
  const userCartLessonSkus = user.cart.map(x => x.lesson.sku)

    const addressTypes = user.addresses.map(address => console.log(address.type));
    const billingAddresses = user.addresses.filter(address => address.type === 'Billing');
    const shippingAddresses = user.addresses.filter(address => address.type === 'Shipping')
    const primaryShippingAddresses = shippingAddresses.filter(address => address.primary === true)
    const primaryBillingAddresses = billingAddresses.filter(address => address.primary === true)

    console.log(`
        addressTypes: ${addressTypes},
        billingAddresses: ${billingAddresses[0].type}
        shippingAddresses: ${shippingAddresses[0].type},
        primaryShippingAddresses: ${primaryShippingAddresses[0].type},${primaryShippingAddresses[0].street},
        primaryBillingAddresses: ${primaryBillingAddresses[0].type},${primaryBillingAddresses[0].street}
      `);

return (
<div className="CreateFormContainer">
<Form onSubmit={props.onConfirm}>

<Form.Row>
<Form.Group as={Col} controlId="formGridType">
  <Form.Label>Type</Form.Label>
  <Form.Control as="select">
  <option>type a</option>
  <option>type b</option>
  </Form.Control>
</Form.Group>

</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridTotalA">
  <Form.Label>TotalA</Form.Label>
  <Form.Control type="number"step="0.01" placeholder="Enter TotalA"/>
</Form.Group>
<Form.Group as={Col} controlId="formGridTotalB">
  <Form.Label>TotalB</Form.Label>
  <Form.Control type="number"step="0.01" placeholder="Enter TotalB"/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridTaxDescription">
  <Form.Label>TaxDescription</Form.Label>
  <Form.Control as="textarea" rows="5" placeholder="Enter TaxDescription"/>
</Form.Group>
<Form.Group as={Col} controlId="formGridTaxAmount">
  <Form.Label>TaxAmount</Form.Label>
  <Form.Control type="number"step="0.01" placeholder="Enter TaxAmount"/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridDescription">
  <Form.Label>Description</Form.Label>
  <Form.Control as="textarea" rows="5" placeholder="Enter Description"/>
</Form.Group>
<Form.Group as={Col} controlId="formGridNotes">
  <Form.Label>Notes</Form.Label>
  <Form.Control as="textarea" rows="5" placeholder="Enter Notes"/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridPayment">
  <Form.Label>Payment</Form.Label>
  <Form.Control as="textarea" rows="5" placeholder="Enter Payment"/>
</Form.Group>
<Form.Group as={Col} controlId="formGridShipping">
  <Form.Label>Shipping</Form.Label>
  <Form.Control as="textarea" rows="5" placeholder="Enter Shipping"/>
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
{user.addresses !== null &&
  user.addresses !== [] && (
    <UserAddressList
      userAddresses={user.addresses}
      authId={props.authId}
      orderForm={true}
      addToOrder={props.addAddressToOrder}
    />
  )}
  </Form.Row>

  <Form.Row>
  <Form.Group as={Col} controlId="formGridBillingAddress">
    <Form.Label>BillingAddress</Form.Label>
    <Form.Control as="textarea"rows="7"  value={props.orderBillingAddress}/>
  </Form.Group>
  </Form.Row>
  <Form.Row>
  <Form.Group as={Col} controlId="formGridShippingAddress">
    <Form.Label>ShippingAddress</Form.Label>
    <Form.Control as="textarea"rows="5" value={props.orderShippingAddress}/>
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

export default CreateOrderForm;
