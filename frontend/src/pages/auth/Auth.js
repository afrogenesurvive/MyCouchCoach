import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

import './Auth.css';
import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/AlertBox';
import LoadingOverlay from '../../components/LoadingOverlay';
import SidebarControl from '../../components/SidebarControl';

import UserProfile from '../user/UserProfile';

class AuthPage extends Component {
  state = {
    role: null,
    userAlert: null,
    overlay: false,
    overlayStatus: "test",
    activeTab: "choose",
    userSeshStore: false,
    user: {},
    model: {},
  };
  static contextType = AuthContext;

  componentDidMount() {
    if (sessionStorage.getItem('token')) {
      this.setState({userAlert: "sessionStorage found...",userSeshStore: true });
      this.getThisUser();
    }
  }

  retrieveLogin = () => {
    console.log("retrieving login");
    this.context.login(
      sessionStorage.getItem('token'),
      sessionStorage.getItem('activityId'),
      sessionStorage.getItem('role'),
      sessionStorage.getItem('tokenExpiration'),
    );
  };

  submitHandler = event => {
    event.preventDefault();

    this.setState({ userAlert: "Logging you in..."})
    const email = event.target.formBasicEmail.value;
    const password = event.target.formBasicPassword.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = null;
      requestBody = {
        query: `
          query {login(email:"${email}",password:"${password}")
          {activityId,role,token,tokenExpiration}}
        `};

    fetch('http://localhost:7077/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(2,25)
        this.setState({userAlert: responseAlert})
        let sessionStorageLoginInfo = null;

        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.activityId,
            resData.data.login.role,
            resData.data.login.tokenExpiration
          );
         sessionStorage.setItem('token', resData.data.login.token);
         sessionStorage.setItem('activityId', resData.data.login.activityId);
         sessionStorage.setItem('role', resData.data.login.role);
         sessionStorage.setItem('tokenExpiration', resData.data.login.tokenExpiration);
        }
      })
      .catch(err => {
        if (this.isActive) {
          this.setState({userAlert: err});
        }
        // this.context.userAlert = err;
        // console.log(`
        //   err: ${this.context.userAlert}
        //   `);
      });
  };

  showSidebar = () => {
        this.setState({
          sidebarShow: true,
          mCol2Size: 9
        })
    }

  hideSidebar = () => {
        this.setState({
          sidebarShow: false,
          mCol2Size: 11
        })
    }

    getThisUser() {

      const activityId = sessionStorage.getItem('activityId');
      const token = sessionStorage.getItem('token');
      const requestBody = {
        query: `
        query {getThisUser(activityId:"${activityId}")
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,message,sender{role,ref},receiver{ref}},transactions{_id,date,time},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
          `};

      fetch('http://localhost:7077/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }})
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
          }
          return res.json();
        })
        .then(resData => {
          const thisUser = resData.data.getThisUser;
          this.context.user = thisUser;
          // check verification herre??
          this.retrieveLogin();
        })
        .catch(err => {
          this.setState({userAlert: err});
        });
    }

  render() {
    return (
      <Container className="loginPageContainer">
      <AlertBox
        authId={this.context.activityId}
        alert={this.state.userAlert}
      />

      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )}

        <Row className="loginPageContainerRow2">
        <Col className="loginPageContainerCol2">
          <Form className="auth-form" onSubmit={this.submitHandler}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email"/>
              <Form.Text className="text-muted">
                User Login
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="outline-success" type="submit" className="loginButton" size="lg">
              Login
            </Button>

            <Button variant="outline-warning" className="loginButton" size="lg">
              <NavLink to="/signup">Signup</NavLink>
            </Button>
          </Form>
        </Col>
        </Row>
      </Container>

    );
  }
}

export default AuthPage;
