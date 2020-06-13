import React from 'react';
// import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
// import Accordion from 'react-bootstrap/Accordion';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateUserForm.css';

// import UserAddressList from '../../Users/UserList/UserAddressList';

const CreateOrderForm = (props) => {
  const {...user} = props.user;
  // const userCartLessonSkus = user.cart.map(x => x.lesson.sku);
    // const addressTypes = user.addresses.map(address => console.log(address.type));
    const billingAddresses = user.addresses.filter(address => address.type === 'Billing');
    const shippingAddresses = user.addresses.filter(address => address.type === 'Shipping')
    const primaryShippingAddresses = shippingAddresses.filter(address => address.primary === true)
    const primaryBillingAddresses = billingAddresses.filter(address => address.primary === true)
    const primaryShippingAddress = primaryShippingAddresses[0];
    const primaryBillingAddress = primaryBillingAddresses[0];

    // console.log('props.cart',props.cart);

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
  <Form.Control type="number"step="0.01" value={props.subtotal}/>
</Form.Group>
<Form.Group as={Col} controlId="formGridTotalB">
  <Form.Label>TotalB</Form.Label>
  <Form.Control type="number"step="0.01" value={0}/>
</Form.Group>
<Form.Group as={Col} controlId="formGridTotalC">
  <Form.Label>TotalC</Form.Label>
  <Form.Control type="number"step="0.01" value={0}/>
</Form.Group>
</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridTaxDescription">
  <Form.Label>TaxDescription</Form.Label>
  <Form.Control as="textarea" rows="3" placeholder='tax description'/>
</Form.Group>
<Form.Group as={Col} controlId="formGridTaxAmount">
  <Form.Label>TaxAmount</Form.Label>
  <Form.Control type="number"step="0.01"value={0}/>
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
  <Form.Group as={Col} controlId="formGridBillingAddressNumber">
    <Form.Label>BillingAddressNumber</Form.Label>
    <Form.Control type="number"  value={primaryBillingAddress.number}/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridBillingAddressStreet">
    <Form.Label>BillingAddressStreet</Form.Label>
    <Form.Control type="text"  value={primaryBillingAddress.street}/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridBillingAddressTown">
    <Form.Label>BillingAddressTown</Form.Label>
    <Form.Control type="text"  value={primaryBillingAddress.town}/>
  </Form.Group>
  </Form.Row>
  <Form.Row>
  <Form.Group as={Col} controlId="formGridBillingAddressCity">
    <Form.Label>BillingAddressCity</Form.Label>
    <Form.Control type="text"  value={primaryBillingAddress.city}/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridBillingAddressCountry">
    <Form.Label>BillingAddressCountry</Form.Label>
    <Form.Control type="text"  value={primaryBillingAddress.country}/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridBillingAddressPostalCode">
    <Form.Label>BillingAddressPostalCode</Form.Label>
    <Form.Control type="text"  value={primaryBillingAddress.postalCode}/>
  </Form.Group>
  </Form.Row>

  <Form.Row>
  <Form.Group as={Col} controlId="formGridShippingAddressNumber">
    <Form.Label>ShippingAddressNumber</Form.Label>
    <Form.Control type="number"  value={primaryShippingAddress.number}/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridShippingAddressStreet">
    <Form.Label>ShippingAddressStreet</Form.Label>
    <Form.Control type="text"  value={primaryShippingAddress.street}/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridShippingAddressTown">
    <Form.Label>ShippingAddressTown</Form.Label>
    <Form.Control type="text"  value={primaryShippingAddress.town}/>
  </Form.Group>
  </Form.Row>
  <Form.Row>
  <Form.Group as={Col} controlId="formGridShippingAddressCity">
    <Form.Label>ShippingAddressCity</Form.Label>
    <Form.Control type="text"  value={primaryShippingAddress.city}/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridShippingAddressCountry">
    <Form.Label>ShippingAddressCountry</Form.Label>
    <Form.Control type="text"  value={primaryShippingAddress.country}/>
  </Form.Group>
  <Form.Group as={Col} controlId="formGridShippingAddressPostalCode">
    <Form.Label>ShippingAddressPostalCode</Form.Label>
    <Form.Control type="text"  value={primaryShippingAddress.postalCode}/>
  </Form.Group>
  </Form.Row>

{props.stripePaid === false && (
  <Form.Row>
      <Button variant="primary" onClick={props.startStripeCheckout}>
        Pay w/ Stripe
      </Button>
  </Form.Row>
)}

<Form.Row>
  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>
  {props.stripePaid === true && (
    <Button variant="primary" className="formButton" type="submit">
      Create
    </Button>
  )}
</Form.Row>


</Form>
</div>

)};

export default CreateOrderForm;
