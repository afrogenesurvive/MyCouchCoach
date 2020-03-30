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
import ModelProfile from '../model/ModelProfile';


class AuthPage extends Component {
  state = {
    role: null,
    userAlert: null,
    overlay: false,
    overlayStatus: "test",
    activeTab: "choose",
    userSeshStore: false,
    modelSeshStore: false,
    user: {},
    model: {},
  };
  static contextType = AuthContext;

  componentDidMount() {

    const token = sessionStorage.getItem('token');
    const activityId = sessionStorage.getItem('activityId');
    const role = sessionStorage.getItem('role');
    const tokenExpiration = sessionStorage.getItem('tokenExpiration');
    if ( role === "User" ) {
      console.log("sessionStorage found: User");
      this.setState({userAlert: "sessionStorage found...",userSeshStore: true });
      this.getThisUser();
    }
    if ( role === "Model" ) {
      console.log("sessionStorage found: Model");
      this.setState({userAlert: "sessionStorage found...",userSeshStore: true });
      this.getThisModel();
    }
    if (role === "No sessionStorage found") {
      console.log();
      this.setState({ userAlert: "Alerts shown here..." });
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
    if (this.state.role === "User") {
      requestBody = {
        query: `
          query {userLogin(email:"${email}",password:"${password}")
          {activityId,role,token,tokenExpiration}}
        `};
    }
    if (this.state.role === "Model") {
      requestBody = {
        query: `
          query {modelLogin(email:"${email}",password:"${password}")
          {activityId,role,token,tokenExpiration}}
        `};
    }

    fetch('http://localhost:9009/graphql', {
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

        if (resData.data.modelLogin) {
          this.context.login(
            resData.data.modelLogin.token,
            resData.data.modelLogin.activityId,
            resData.data.modelLogin.role,
            resData.data.modelLogin.tokenExpiration
          );
          sessionStorage.setItem('token', resData.data.modelLogin.token);
          sessionStorage.setItem('activityId', resData.data.modelLogin.activityId);
          sessionStorage.setItem('role', resData.data.modelLogin.role);
          sessionStorage.setItem('tokenExpiration', resData.data.modelLogin.tokenExpiration);
        }

        if (resData.data.userLogin.token) {
          this.context.login(
            resData.data.userLogin.token,
            resData.data.userLogin.activityId,
            resData.data.userLogin.role,
            resData.data.userLogin.tokenExpiration
          );
         sessionStorage.setItem('token', resData.data.userLogin.token);
         sessionStorage.setItem('activityId', resData.data.userLogin.activityId);
         sessionStorage.setItem('role', resData.data.userLogin.role);
         sessionStorage.setItem('tokenExpiration', resData.data.userLogin.tokenExpiration);

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

  changeLoginMode = (args) => {
    this.setState({role: args})
  }

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

      fetch('http://localhost:9009/graphql', {
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
          // check verification herre
          this.retrieveLogin();
        })
        .catch(err => {
          this.setState({userAlert: err});
        });
    }

    getThisModel() {
      console.log("getThisModel");
      const activityId = sessionStorage.getItem('activityId');
      const token = sessionStorage.getItem('token');
      const requestBody = {
        query: `
        query {getThisModel(activityId:"${activityId}")
        {_id,name,role,dob,username,modelNames,contact{email,phone},address{number,street,town,city,country},bio,socialMedia{platform,handle},traits{key,value},profileImages{name,type,path},interests,perks{date,name,description},tokens,fans{_id,name,username},friends{_id,name},tags,loggedIn,categories,shows{_id,scheduledDate,scheduledTime},content{_id,title},comments{_id,date,content{_id}},messages{_id,date,time},transactions{_id,date,time}}}
          `};

      fetch('http://localhost:9009/graphql', {
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
          const thisModel = resData.data.getThisModel;
          this.context.model = thisModel;
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

        <Row className="loginPageContainerRow1">


        <Col className="loginPageContainerCol1">
        <h4 className="loginPageTitle"> Welcome Back you Perv: Login </h4>
        <Button variant="primary" className="loginButton1" size="lg" onClick={this.changeLoginMode.bind(this, "User")}>User Login</Button>
        <Button variant="success" className="loginButton1" size="lg" onClick={this.changeLoginMode.bind(this, "Model")}>Model Login</Button>
        </Col>

        </Row>

        <Row className="loginPageContainerRow2">
        <Col className="loginPageContainerCol2">

        {this.state.role === "User" && (
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
              <NavLink to="/signup">Signup as User</NavLink>
            </Button>
          </Form>
        )}
        {this.state.role === "Model" && (
          <Form className="auth-form" onSubmit={this.submitHandler}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email"/>
              <Form.Text className="text-muted">
                Model Login
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
              <NavLink to="/signup">Signup as Model</NavLink>
            </Button>
          </Form>
        )}
        </Col>
        </Row>
      </Container>



    );
  }
}

export default AuthPage;
