import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ResetPasswordForm from '../../components/Forms/user/ResetPasswordForm'
import { useParams, NavLink } from 'react-router-dom';

import "./AttachmentViewer.css"

const PasswordReset = (props) => {
  let {params} = useParams();

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">

    <Row className="loginPageContainerRow2">
    <Col className="loginPageContainerCol2">
      <h1>Password Reset</h1>

      {props.resetState === 'complete' && (
        <p>Success...Password reset...</p>
      )}
      {props.resetState === 'error' && (
        <p>
          An Error occured...
          </p>
      )}
      {props.resetState === 'cancelled' && (
        <p>Change your mind...? Request a new Password from the login page...</p>
      )}


      <p>{props.message}</p>

      {props.resetState === 'complete' && (
        <NavLink to="/auth">
        <Button variant="secondary">
          Login
        </Button>
        </NavLink>
      )}
      {props.resetState === 'cancelled' && (
        <NavLink to="/auth">
        <Button variant="secondary">
          Login
        </Button>
        </NavLink>
      )}

      {props.resetState === 'incomplete' && (
      <ResetPasswordForm
        params={params}
        onConfirm={props.passwordReset}
        onCancel={props.cancelPasswordReset}
      />
      )}

    </Col>
    </Row>

    </div>
  </div>
)

}


export default PasswordReset;
