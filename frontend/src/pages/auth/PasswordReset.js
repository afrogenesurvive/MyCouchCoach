import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ResetPasswordForm from '../../components/Forms/user/ResetPasswordForm'
import { useParams, NavLink } from 'react-router-dom';

import "./AttachmentViewer.css"

const PasswordReset = (props) => {
  let {user} = useParams();

return (
  <div className="attachmentViewerBg">
    <div className="attachmentViewer">

    <Row className="loginPageContainerRow2">
    <Col className="loginPageContainerCol2">
      <h1>Password Reset</h1>

      {props.resetState === 'complete' && (
        <h1>Success...Password reset...</h1>
      )}

      {props.resetState === 'complete' && (
        <NavLink to="/auth">
        <Button variant="secondary">
          Login
        </Button>
        </NavLink>
      )}

      {props.resetState === 'incomplete' && (
      <ResetPasswordForm
        userId={user}
        onConfirm={props.passwordReset}
      />
      )}

    </Col>
    </Row>

    </div>
  </div>
)

}


export default PasswordReset;
