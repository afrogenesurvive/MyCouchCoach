import React from 'react';
import GooglePicker from 'react-google-picker';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import AuthContext from '../../context/auth-context';
import './CreateUserForm.css';

const UpdateUserAttachmentForm = (props) => {
const {...user} = props.user;
// const gdriveCreds = AuthContext._currentValue.creds.gdrive;

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>
<Form.Row>

  <Form.Group as={Col} controlId="formGridAttachmentFormat">
    <Form.Label>Format</Form.Label>
    <Form.Control type="string" placeholder="File format"/>
  </Form.Group>
  </Form.Row>

  <Form.Row>
  <Form.Group as={Col} controlId="formGridAttachmentFile">
    <Form.Label>File</Form.Label>
    <Form.Control type="file" id="fileInput" placeholder="File" onChange={(e) => {console.log(e.target.files[0]);AuthContext._currentValue.file = e.target.files[0];console.log(AuthContext._currentValue.file);}}/>
  </Form.Group>
</Form.Row>

{
// <Form.Row>
// <GooglePicker clientId={'gdriveCreds.clientId'}
//             developerKey={'gdriveCreds.developerKey'}
//             scope={['https://www.googleapis.com/auth/drive.readonly']}
//               onChange={data => console.log('on change:', data)}
//               onAuthenticate={token => console.log('oauth token:', token)}
//               onAuthFailed={data => console.log('on auth failed:', data)}
//               multiselect={true}
//               navHidden={true}
//               authImmediate={false}
//               mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
//               viewId={'DOCS'}>
//             <Button variant="primary" className="formButton">
//             Google Picker
//             </Button>
// </GooglePicker>
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

export default UpdateUserAttachmentForm;
