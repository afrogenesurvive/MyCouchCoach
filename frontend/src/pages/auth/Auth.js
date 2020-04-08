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
import VerifyUserForm from '../../components/Forms/user/VerifyUserForm';

import UserProfile from '../user/UserProfile';

class AuthPage extends Component {
  state = {
    verifying: false,
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
    // const activityId = sessionStorage.getItem('activityId');
    // const token = sessionStorage.getItem('token');
    //
    // let requestBody = null;
    //   requestBody = {
    //     query: `
    //       mutation {userOnline(
    //         activityId:"${activityId}",
    //         userId:"${activityId}"
    //       )
    //       {_id,password,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
    //     `};
    //
    // fetch('http://localhost:7077/graphql', {
    //   method: 'POST',
    //   body: JSON.stringify(requestBody),
    //   headers: {
    //     'Content-Type': 'application/json',
    //
    //   }
    // })
    //   .then(res => {
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error('Failed!');
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     console.log(resData.data);
    //     this.context.user = resData.data.userOnline
    //     console.log("retrieving login");
    //     this.context.login(
    //       sessionStorage.getItem('token'),
    //       sessionStorage.getItem('activityId'),
    //       sessionStorage.getItem('role'),
    //       sessionStorage.getItem('tokenExpiration'),
    //     );
    //   })
    //   .catch(err => {
    //     if (this.isActive) {
    //       this.setState({userAlert: err});
    //     }
    //   });

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
          {activityId,role,token,tokenExpiration,error}}
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
          // let foo = res.json();
          // console.log(res,res.body,foo);
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // let errors = null;
        // if (
        //   resData.errors ||
        //   JSON.stringify(resData).slice(2,7) === 'error'
        // ) {
        //   errors = JSON.stringify({...resData.errors});
        //   this.setState({userAlert: "Something went wrong!!!"+errors+""})
        // }
        console.log(resData.data.login.error);
        let responseAlert = JSON.stringify(resData.data).slice(2,25);
        let error = null;
        if (resData.data.login.error) {
          error = resData.data.login.error;
          responseAlert = error;
        }

        this.setState({userAlert: responseAlert})
        let sessionStorageLoginInfo = null;

        if (resData.data.login.token !== "") {
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
      // console.log("get this user...");
      const activityId = sessionStorage.getItem('activityId');
      const token = sessionStorage.getItem('token');
      const requestBody = {
        query: `
          query {getThisUser(activityId:"${activityId}")
          {_id,password,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

    verifyUser = (event) => {
      event.preventDefault();
      const contactEmail = event.target.formGridEmail.value;
      const verificationType = event.target.formGridType.value;
      const verificationCode = event.target.formGridCode.value;

      const requestBody = {
        query: `
        mutation {verifyUser(
          userInput:{
            contactEmail:"${contactEmail}",
            verificationType:"${verificationType}",
            verificationCode:"$verificationCode{}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id}},attendedLessons{date,ref{_id}},taughtLessons{date,ref{_id}},wishlist{date,ref{_id},booked},cart{dateAdded,sessionDate,lesson{_id}},reviews{_id},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
          `};

        console.log(JSON.stringify(requestBody));

      fetch('http://localhost:7077/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        }})
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData.data.verifyUser);
          this.setState({userAlert: 'Verified...Please try loggin in again..'});
        })
        .catch(err => {
          this.setState({userAlert: err});
        });
    }

    startVerification = () => {
      this.setState({verifying: true})
    };
    closeVerification = () => {
      this.setState({verifying: false})
    };

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
        <Row className="loginPageContainerRow2">
          <Col className="loginPageContainerCol2">
            <Button variant="outline-primary" onClick={this.startVerification}>Verify</Button>
            {this.state.verifying === true && (
              <VerifyUserForm
                canCancel
                canConfirm
                onCancel={this.closeVerification}
                onConfirm={this.verifyUser}
              />
            )}
          </Col>
        </Row>
      </Container>

    );
  }
}

export default AuthPage;
