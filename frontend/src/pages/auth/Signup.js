import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import AlertBox from '../../components/AlertBox';
import CreateUserForm from '../../components/Forms/user/CreateUserForm';
import LoadingOverlay from '../../components/LoadingOverlay';
import './Auth.css';

class SignupPage extends Component {
  state = {
    role: null,
    success: "Signup!!",
    userAlert: null,
    overlay: false,
    overlayStatus: "test",
    creating: false,
  };

  modalConfirmUserHandler = (event) => {
    event.preventDefault();

    this.setState({ creating: false, userAlert: "Signing you up...." });
    let contactEmail = event.target.formGridEmail.value;
    let password = event.target.formGridPassword.value;
    let name = event.target.formGridName.value;
    let username = event.target.formGridUsername.value;
    let role = event.target.formGridRole.value;
    let publicProfile = false;
    if (event.target.formGridPublicCheckbox.checked === true) {
      publicProfile = true;
    }
    let dob = event.target.formGridDob.value;
    let contactPhone = event.target.formGridPhone.value;
    let contactPhone2 = event.target.formGridPhone2.value;
    let addressType = event.target.formGridAddressType.value;
    let addressNumber = event.target.formGridAddressNumber.value;
    let addressStreet = event.target.formGridAddressStreet.value;
    let addressTown = event.target.formGridAddressTown.value;
    let addressCity = event.target.formGridAddressCity.value;
    let addressCountry = event.target.formGridAddressCountry.value;
    let addressPostalCode = event.target.formGridAddressPostalCode.value;
    let bio = event.target.formGridBio.value;

    if (
      contactEmail.trim().length === 0 ||
      password.trim().length === 0 ||
      name.trim().length === 0 ||
      username.trim().length === 0 ||
      role.trim().length === 0 ||
      dob.trim().length === 0 ||
      contactPhone.trim().length === 0 ||
      contactPhone2.trim().length === 0 ||
      addressType.trim().length === 0 ||
      addressNumber.trim().length === 0 ||
      addressStreet.trim().length === 0 ||
      addressTown.trim().length === 0 ||
      addressCity.trim().length === 0 ||
      addressCountry.trim().length === 0 ||
      addressPostalCode.trim().length === 0 ||
      bio.trim().length === 0
    ) {
      this.setState({userAlert: "blank fields detected!!!...Please try again..."});
      return;
    }

    const token = this.context.token;
    const requestBody = {
      query: `
            mutation {createUser(
              userInput:{
                role:"${role}",
                name:"${name}",
                password:"${password}",
                username:"${username}",
                dob:"${dob}",
                public:${publicProfile},
                contactEmail:"${contactEmail}",
                contactPhone:"${contactPhone}",
                contactPhone2:"${contactPhone2}",
                addressType:"${addressType}",
                addressNumber:${addressNumber},
                addressStreet:"${addressStreet}",
                addressTown:"${addressTown}",
                addressCity:"${addressCity}",
                addressCountry:"${addressCountry}",
                addressPostalCode:"${addressPostalCode}",
                bio:"${bio}"
              })
            {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
          `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {

        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const newUser = resData.data.createUser;
          const errors = JSON.stringify({...resData.errors});
          if (JSON.stringify(resData).slice(2,7) === 'error') {
            this.setState({success: "Something went wrong!!!", userAlert: "Something went wrong!!!"+errors+""  });
          } else {
            this.setState({success: "Signup success...Proceed to login", userAlert: "Signup success...Proceed to login... your verification code is.."+newUser.verification.code+"" });
          }
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  cancelSignup = () => {
    this.setState({creating: false, role: null})
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

        <CreateUserForm
          canCancel
          canConfirm
          onConfirm={this.modalConfirmUserHandler}
          onSubmit={this.modalConfirmUserHandler}
          confirmText="Confirm"
          successText={this.state.success}
          onCancel={this.cancelSignup}
        />

      </Col>
      </Row>
      </Container>

      </React.Fragment>
    );
  }
}

export default SignupPage;
