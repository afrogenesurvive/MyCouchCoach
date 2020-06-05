import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import AuthContext from '../../../context/auth-context';

import './CreateUserForm.css';

const AddLessonFileForm = (props) => {
// const {...user} = props.user;

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

{
// <Form.Row>
//   <Form.Group as={Col} controlId="formGridName">
//   <Form.Label>Filename</Form.Label>
//   <Form.Control type="text" placeholder="Filename"/>
// </Form.Group>
// </Form.Row>
//
// <Form.Row>
//   <Form.Group as={Col} controlId="formGridSize">
//   <Form.Label>Filesize</Form.Label>
//   <Form.Control type="text" placeholder="Filesize"/>
// </Form.Group>
// </Form.Row>
// <Form.Row>
//   <Form.Group as={Col} controlId="formGridType">
//   <Form.Label>Filetype</Form.Label>
//   <Form.Control type="text" placeholder="Filetype"/>
// </Form.Group>
// </Form.Row>
//
// <Form.Row>
//   <Form.Group as={Col} controlId="formGridPath">
//   <Form.Label>Link Address</Form.Label>
//   <Form.Control type="text" placeholder="link address"/>
// </Form.Group>
// </Form.Row>
}

<Form.Row>
  <Form.Group as={Col} controlId="formGridPublic">
    <Form.Label>Public</Form.Label>
    <Form.Control as="select">
    <option>true</option>
    <option>false</option>
    </Form.Control>
  </Form.Group>
</Form.Row>

<Form.Row>
  <Form.Group as={Col}>
    <Form.Label>File</Form.Label>
    <Form.Control type="file" id="fileInput" placeholder="File" onChange={(e) => {console.log(e.target.files[0]);AuthContext._currentValue.file = e.target.files[0];console.log(AuthContext._currentValue.file);}}/>
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

export default AddLessonFileForm;
