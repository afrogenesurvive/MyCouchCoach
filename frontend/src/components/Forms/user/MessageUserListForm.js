import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const MessageUserListForm = (props) => {
const {...receiver} = props.receiver;

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>
<Form.Row>
  <p>Recipient: {receiver.username}</p>
</Form.Row>


  <Form.Row>
  <Form.Group className="searchInput" controlId="formBasicTypeSelect">
  <Form.Label>Type</Form.Label>
  <Form.Control as="select">
  <option>type a</option>
  <option>type j</option>
  </Form.Control>
  <Form.Text className="text-muted">
  </Form.Text>
  </Form.Group>

  <Form.Group as={Col} controlId="formGridSubject">
    <Form.Label>Subject </Form.Label>
    <Form.Control type="text" placeholder="Subject"/>
  </Form.Group>
</Form.Row>

  <Form.Row>
  <Form.Group as={Col} controlId="formGridMessage">
    <Form.Label>Message </Form.Label>
    <Form.Control as="textarea" rows="7" placeholder="Message"/>
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

export default MessageUserListForm;
