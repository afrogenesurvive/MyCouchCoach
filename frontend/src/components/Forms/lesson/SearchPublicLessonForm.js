import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './CreateUserForm.css';

const SearchPublicLessonForm = (props) => {

return (
<div className="SearchFormContainer">
  <Form onSubmit={props.onConfirm}>

  <Form.Row>
  <Form.Group className="searchInput" controlId="formBasicFieldSelect">
  <Form.Label>Regex Field</Form.Label>
  <Form.Control as="select">
  <option>title</option>
  <option>type</option>
  <option>category</option>
  <option>description</option>
  <option>duration</option>
  <option>tags</option>
  </Form.Control>
  <Form.Text className="text-muted">
  </Form.Text>
  </Form.Group>

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

export default SearchPublicLessonForm;
