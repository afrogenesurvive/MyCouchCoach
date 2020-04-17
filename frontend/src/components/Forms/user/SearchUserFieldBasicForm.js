import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './CreateUserForm.css';

const SearchUserFieldBasicForm = (props) => {

return (
<div className="SearchFormContainer">
  <Form onSubmit={props.onConfirm}>


  <Form.Row>
  {
    <Form.Group className="searchInput" controlId="formBasicFieldSelect">
    <Form.Label>Basic Field</Form.Label>
    <Form.Control as="select">
    <option>select</option>
    <option>public</option>
    <option>loggedIn</option>
    <option>clientConnected</option>
    <option>dob</option>
    <option>age</option>
    <option>points</option>
    <option>friends</option>
    <option>bookedLessons.ref</option>
    <option>likedLessons.ref</option>
    <option>attendedLessons.ref</option>
    </Form.Control>
    <Form.Text className="text-muted">
    </Form.Text>
    </Form.Group>
}


  <Form.Group className="searchInput" controlId="formBasicQuery">
  <Form.Label>Basic Query</Form.Label>
  <Form.Control type="textarea" rows="5" placeholder="Query"/>
  </Form.Group>

  {props.canCancel && (
    <Button variant="danger" className="searchFormBtn" onClick={props.onCancel}>Cancel</Button>
  )}

  {props.canConfirm && (
    <Button variant="primary" className="searchFormBtn" type="submit">
    Submit
    </Button>
  )}
  </Form.Row>



</Form>
</div>


)};

export default SearchUserFieldBasicForm;
