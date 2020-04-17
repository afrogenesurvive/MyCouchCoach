import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './CreateUserForm.css';

const SearchUserFieldRegexForm = (props) => {

return (
<div className="SearchFormContainer">
  <Form onSubmit={props.onConfirm}>


  <Form.Row>
  {
    <Form.Group className="searchInput" controlId="formBasicFieldSelect">
    <Form.Label>Regex Field</Form.Label>
    <Form.Control as="select">
    <option>select</option>
    <option>_id</option>
    <option>username</option>
    <option>role</option>
    <option>contact.phone</option>
    <option>contact.phone2</option>
    <option>contact.email</option>
    <option>socialMedia.platform</option>
    <option>socialMedia.handle</option>
    <option>tags</option>
    <option>interests</option>
    <option>bookedLessons.session.title</option>
    </Form.Control>
    <Form.Text className="text-muted">
    </Form.Text>
    </Form.Group>
}


  <Form.Group className="searchInput" controlId="formBasicQuery">
  <Form.Label>Regex Query</Form.Label>
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

export default SearchUserFieldRegexForm;
