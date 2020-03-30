import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import AlertBox from '../../components/AlertBox';
import CreateUserForm from '../../components/Forms/user/CreateUserForm';
import CreateModelForm from '../../components/Forms/model/CreateModelForm';
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
    let email = event.target.formGridEmail.value;
    let password = event.target.formGridPassword.value;
    let name = event.target.formGridName.value;
    let username = event.target.formGridUsername.value;
    let role = "User";
    let dob = event.target.formGridDob.value;
    let phone = event.target.formGridPhone.value;
    let addressNumber = event.target.formGridAddressNumber.value;
    let addressStreet = event.target.formGridAddressStreet.value;
    let addressTown = event.target.formGridAddressTown.value;
    let addressCity = event.target.formGridAddressCity.value;
    let addressCountry = event.target.formGridAddressCountry.value;
    let addressPostalCode = event.target.formGridAddressPostalCode.value;
    let bio = event.target.formGridBio.value;


    // let employmentDate = event.target.formGridEmploymentDate.value;
    // if (event.target.formGridEmploymentDateTodayCheckbox.checked === true) {
    //   employmentDate = new Date().toISOString().slice(0,10);
    // }
    //
    // if (
    //   event.target.staffCalendarEmploymentDate.value !== null &&
    //   event.target.formGridEmploymentDateTodayCheckbox.checked !== true
    // ) {
    //   console.log("fancyDate2", new Date(event.target.staffCalendarEmploymentDate.value).toISOString().slice(0,10));
    //   employmentDate = new Date(event.target.staffCalendarEmploymentDate.value).toISOString().slice(0,10);
    // }

    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      name.trim().length === 0 ||
      username.trim().length === 0 ||
      role.trim().length === 0 ||
      dob.trim().length === 0 ||
      phone.trim().length === 0 ||
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
          mutation {createUser(userInput:{
            name:"${name}",
            role:"${role}",
            username:"${username}",
            password:"${password}",
            contactEmail:"${email}",
            contactPhone:"${phone}",
            addressNumber:${addressNumber},
            addressStreet:"${addressStreet}",
            addressTown:"${addressTown}",
            addressCity:"${addressCity}",
            addressCountry:"${addressCountry}",
            addressPostalCode:"${addressPostalCode}",
            dob:"${dob}",
            bio:"${bio}"
          })
          {_id,name,role,dob,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description},models{_id,name,username,contact{email}},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,message,sender{role,ref},receiver{ref}},transactions{_id,date,time},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
          `};

    fetch('http://localhost:9009/graphql', {
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
        if (JSON.stringify(resData).slice(2,7) === 'error') {
          this.setState({success: "Something went wrong!!!", userAlert: "Something went wrong!!!"  });
        } else {
          this.setState({success: "Signup success...Proceed to login", userAlert: "Signup success...Proceed to login" });
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  modalConfirmModelHandler = (event) => {
    event.preventDefault();

    this.setState({ creating: false, userAlert: "Signing you up...." });
    const contactEmail = event.target.formGridEmail.value;
    const password = event.target.formGridPassword.value;
    const name = event.target.formGridName.value;
    const username = event.target.formGridUsername.value;
    const modelName = event.target.formGridModelname.value;
    const role = "Model";
    let dob = event.target.formGridDob.value;
    let contactPhone = event.target.formGridPhone.value;
    let addressNumber = event.target.formGridAddressNumber.value;
    let addressStreet = event.target.formGridAddressStreet.value;
    let addressTown = event.target.formGridAddressTown.value;
    let addressCity = event.target.formGridAddressCity.value;
    let addressCountry = event.target.formGridAddressCountry.value;
    let addressPostalCode = event.target.formGridAddressPostalCode.value;
    let bio = event.target.formGridBio.value;


    // let employmentDate = event.target.formGridEmploymentDate.value;
    // if (event.target.formGridEmploymentDateTodayCheckbox.checked === true) {
    //   employmentDate = new Date().toISOString().slice(0,10);
    // }
    //
    // if (
    //   event.target.staffCalendarEmploymentDate.value !== null &&
    //   event.target.formGridEmploymentDateTodayCheckbox.checked !== true
    // ) {
    //   console.log("fancyDate2", new Date(event.target.staffCalendarEmploymentDate.value).toISOString().slice(0,10));
    //   employmentDate = new Date(event.target.staffCalendarEmploymentDate.value).toISOString().slice(0,10);
    // }

    if (
      contactEmail.trim().length === 0 ||
      password.trim().length === 0 ||
      name.trim().length === 0 ||
      username.trim().length === 0 ||
      modelName.trim().length === 0 ||
      role.trim().length === 0 ||
      dob.trim().length === 0 ||
      contactPhone.trim().length === 0 ||
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
          mutation {createModel(
            modelInput:{
              name:"${name}",
              role:"${role}",
              username:"${username}",
              modelName:"${modelName}",
              password:"${password}",
              contactEmail:"${contactEmail}",
              contactPhone:"${contactPhone}",
              addressNumber:${addressNumber},
              addressStreet:"${addressStreet}",
              addressTown:"${addressTown}",
              addressCity:"${addressCity}",
              addressCountry:"${addressCountry}",
              addressPostalCode:"${addressPostalCode}",
              dob:"${dob}",
              bio:"${bio}"
            })
          {_id,name,username,role,dob,modelNames,contact{email,phone},address{number,street,town,city,country},bio,socialMedia{platform,handle},traits{key,value},profileImages{name,type,path},interests,perks{date,name,description},tokens,fans{_id,name,username},friends{_id,name},tags,loggedIn,categories,shows{_id,scheduledDate,scheduledTime},content{_id,title},comments{_id,date,content{_id}},messages{_id,date,time},transactions{_id,date,time}}}
          `};

    fetch('http://localhost:9009/graphql', {
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
        if (JSON.stringify(resData).slice(2,7) === 'error') {
          this.setState({success: "Something went wrong!!!", userAlert: "Something went wrong!!!"  });
        } else {
          this.setState({success: "Signup success...Proceed to login", userAlert: "Signup success...Proceed to login" });
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  changeSignupMode = (args) => {
    this.setState({role: args, creating: true})
  }
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

      <Row className="loginPageContainerRow1">

      <Col className="loginPageContainerCol1">
      <h4 className="loginPageTitle"> Welcome you Pervz: Signup </h4>

      {this.state.creating === false && (
      <Button variant="primary" className="loginButton1" onClick={this.changeSignupMode.bind(this, "User")}>User Signup</Button>
      )}
      {this.state.creating === false && (
      <Button variant="success" className="loginButton1" onClick={this.changeSignupMode.bind(this, "Model")}>Model Signup</Button>
      )}

      </Col>

      </Row>

      <Row className="loginPageContainerRow2">
      <Col className="loginPageContainerCol2">

      {this.state.role === "User" &&
        this.state.creating === true && (
        <CreateUserForm
          canCancel
          canConfirm
          onConfirm={this.modalConfirmUserHandler}
          onSubmit={this.modalConfirmUserHandler}
          confirmText="Confirm"
          successText={this.state.success}
          onCancel={this.cancelSignup}
        />
      )}

      {this.state.role === "Model" &&
        this.state.creating === true && (
        <CreateModelForm
          canCancel
          canConfirm
          onConfirm={this.modalConfirmModelHandler}
          onSubmit={this.modalConfirmModelHandler}
          confirmText="Confirm"
          successText={this.state.success}
          onCancel={this.cancelSignup}
        />
      )}

      </Col>
      </Row>
      </Container>

      </React.Fragment>
    );
  }
}

export default SignupPage;
