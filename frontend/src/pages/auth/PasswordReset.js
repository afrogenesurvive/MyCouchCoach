import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useParams } from 'react-router-dom';

// import CreateUserForm from '../../components/Forms/user/CreateUserForm';
import LoadingOverlay from '../../components/LoadingOverlay';
import './Auth.css';

class PasswordReset extends Component {
  state = {

  };

  constructor(props){
      super(props);
      this.user = useParams();
    }

  componentDidMount() {
    console.log('beep');
  }

  render() {
    return (
      <React.Fragment>

      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )}
      <Container className="loginPageContainer">

      <Row className="loginPageContainerRow2">
      <Col className="loginPageContainerCol2">
        <h1>Password Reset</h1>
        <p>{this.user}</p>

      </Col>
      </Row>
      </Container>

      </React.Fragment>
    );
  }
}

export default PasswordReset;
