import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';

import AuthContext from '../context/auth-context';
import AlertBox from '../components/AlertBox';
import LoadingOverlay from '../components/LoadingOverlay';
import './Landing.css';

class LandingPage extends Component {
  state = {
    role: null,
    userAlert: "landing",
    overlay: false,
    overlayStatus: "test",
    isGuest: true,
    context: null,
  };

componentDidMount () {
  // console.log(AuthContext._currentValue.activityId ,AuthContext._currentValue.activityId === null,AuthContext._currentValue.token === null);
  if (AuthContext._currentValue.activityId !== null && AuthContext._currentValue.token !== null ) {
    this.setState({isGuest: false})
    // console.log(this.state);
  }
}

  render() {

    return (
      <React.Fragment>

      <AlertBox
        authUserId={this.context.userId}
        alert={this.state.userAlert}
      />

      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )}
      <Container className="loginPageContainer">

      <Row className="loginPageContainerRow2">
      <Col className="loginPageContainerCol2">
        <h1> Welcome to Couch Coach</h1>
      </Col>
      <Col className="loginPageContainerCol2">

      </Col>
      <Col className="loginPageContainerCol2">
        <p>About Coach Coach</p>
      </Col>
      <Col className="loginPageContainerCol2">
        <p>Featured Lessons go here??</p>
      </Col>
      <Col className="loginPageContainerCol2">

          {this.state.isGuest === true && (
            <NavLink to="/login">Login</NavLink>
          )}
          {this.state.isGuest === true && (
            <NavLink to="/signup">Signup</NavLink>
          )}

      </Col>
      </Row>
      </Container>

      </React.Fragment>
    );

  }


}

export default LandingPage;
