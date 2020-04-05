// import S3 from 'react-aws-s3';
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/AlertBox';
import Spinner from '../../components/Spinner/Spinner';
// import AttachmentViewer from '../../components/AttachmentViewer';
import LoadingOverlay from '../../components/LoadingOverlay';
import SidebarPage from '../Sidebar';
import SidebarControl from '../../components/SidebarControl';

import ThisUserProfile from '../../components/Users/thisUserProfile';

import './Users.css';
// import io from 'socket.io-client';

class UserProfile extends Component {
  state = {
    user: null,
    users: [],
    updating: false,
    adding: false,
    deleting: false,
    updatingField: false,
    isLoading: false,
    userUpdateField: null,
    userAddField: null,
    userAlert: null,
    overlay: false,
    overlayStatus: "test",
    canDelete: null,
    showAttachment: false,
    showThisAttachmentFile: null,
    showThisAttachmentType: null,
    sidebarShow: true,
    mCol1Size: 3,
    mCol2Size: 9,
    messagesLoaded: false,
    userMessages: null,
    finalConfirmation: false,
    socketMsg: "",
    activityA: null,
    activityB: null,
    activityC: null,
    selectedFriendRequest: null,
    requestingFriend: null,
    userSelectedFriend: null
  };

  isActive = true;
  static contextType = AuthContext;

  // constructor(props){
  //     super(props);
  //     this.socket = io('http://localhost:7770');
  //   }

  componentDidMount() {

    this.getThisUser();
    // const conversationId = this.context.activityId;
    // this.socket.emit('msg_subscribe', 'msg'+conversationId);
    // this.socket.emit('trans_subscribe', 'trans'+conversationId);
    // console.log("listening for tokens & pms...");
    // this.socket.on('conversation private post', function(data) {
    //   console.log("you got a new message..",data);
    //   addMessage(data);
    // });
    // const addMessage = data => {
    //   this.setState({
    //     userAlert: `New Msg!!
    //       Fr:   ${data.message.senderName},
    //       Msg:   ${data.message.message}`})
    // };

  }

  startUpdate = () => {
    this.setState({ updating: true });
  };
  startUpdateField = () => {
    this.setState({ updatingField: true });
  };
  startAddHandler = (args) => {
    this.setState({adding: true, userAddField: args})
  }
  addUserField = (args) => {
    this.setState({adding: true, userAddField: args})
  }
  startCreateMessage = () => {
    if (this.context.receiver === null) {
      this.setState({userAlert: "select a receiver 1st..."});
    }
    this.setState({adding: true, userAddField: "message"})
  }

  userEdit = (event) => {
    this.setState({ updating: false, userAlert: "Updating selected Staff ..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    // const userId =

    let contactEmail = event.target.formGridEmail.value;
    let password = event.target.formGridPassword.value;
    let name = event.target.formGridName.value;
    let username = event.target.formGridUsername.value;
    // let role = this.context.user.role;
    let dob = event.target.formGridDob.value;
    let contactType = event.target.formGridType.value;
    let contactPhone = event.target.formGridPhone.value;
    let contactPhone2 = event.target.formGridPhone2.value;
    let bio = event.target.formGridBio.value;

    if (contactEmail.trim().length === 0 ) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      contactEmail = this.context.user.contact.email;
    }
    if (password.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      password = this.context.user.password;
    }
    if (name.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      name = this.context.user.name;
    }
    if (username.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      username = this.context.user.username;
    }
    // if (role.trim().length === 0) {
    //   console.log("blank fields detected!!!...filling w/ previous data...");
    //   role = this.state.user.role;
    // }
    if (dob.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      dob = this.context.user.dob;
    }
    if (bio.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      bio = this.context.user.bio;
    }

    const requestBody = {
      query: `
          mutation {updateUserBasic(
            activityId:"${activityId}",
            userId:"${activityId}",
            userInput:{
              name:"${name}",
              password:"${password}",
              username:"${username}",
              dob:"${dob}",
              contactEmail:"${contactEmail}",
              contactPhone:"${contactPhone}",
              contactPhone2:"${contactPhone2}",
              bio:"${bio}"
            })
            {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
        const updatedUser = resData.data.updateUserBasic;
        this.context.user = updatedUser;
        const responseAlert = JSON.stringify(resData.data.updateUserBasic).slice(2,25);

        this.setState({ userAlert: responseAlert, user: updatedUser, activityA: requestBody})
        // logUserActivity();
        this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
    };

  userEditField = (event) => {
      this.setState({ updatingField: false, userAlert: "Updating selected Staff by Field..." });
      const token = this.context.token;
      const activityId = this.context.activityId;
      let field = null;
      let query = event.target.formGridQuery.value;
      if (event.target.formGridFieldSelect.value === "select") {
        field = event.target.formGridField.value;
      } else {
        field = event.target.formGridFieldSelect.value;
      }

      const requestBody = {
        query:`
          mutation {updateUserByField(
            activityId:"${activityId}",
            userId:"${userId}",
            field:"${field}",
            query:"${query}")
            {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
        `};

      fetch('http://localhost:7077/graphql', {
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
            this.setState({userAlert: "Failed!"})
          }
          return res.json();
        })
        .then(resData => {
          const responseAlert = JSON.stringify(resData.data.updateUserByField).slice(2,25);
          this.setState({ userAlert: responseAlert, user: resData.data.updateUserByField, activityA: requestBody})
          this.context.user = this.state.user;
          // logUserActivity();
        })
        .catch(err => {
          this.setState({userAlert: err});
        });
    }

  userAddPoints = (event) => {
        this.setState({ adding: false, userAddField: null, userAlert: "adding points for user..." });
        const token = this.context.token;
        const activityId = this.context.activityId;
        const points = event.target.formGridPoints.value;

        const requestBody = {
          query:`
            mutation {addUserPoints(
              activityId:"${activityId}",
              userId:"${userId}",
              userInput:{
                points:${points}
              })
              {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
          `};

        fetch('http://localhost:7077/graphql', {
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
              this.setState({userAlert: 'Failed!'});
            }
            return res.json();
          })
          .then(resData => {

            const responseAlert = JSON.stringify(resData.data.addUserPoints).slice(2,25);
            this.setState({userAlert: responseAlert, user: resData.data.addUserPoints, activityA: requestBody})
            this.context.user = this.state.user;
            // logUserActivity();
          })
          .catch(err => {
            this.setState({userAlert: err});
          });
      };

  userAddAddress = () => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding address for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {addUserAddress(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            addressType:"${addressType}",
            addressNumber:${addressNumber},
            addressStreet:"${addressStreet}",
            addressTown:"${addressTown}",
            addressCity:"${addressCity}",
            addressCountry:"${addressCountry}",
            addressPostalCode:"${addressPostalCode}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.addUserAddress).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserAddress, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteAddress = () => {
    this.setState({ deleting: true, userAlert: "deleting address for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {deleteUserAddress(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            addressType:"${addressType}",
            addressNumber:${addressNumber},
            addressStreet:"${addressStreet}",
            addressTown:"${addressTown}",
            addressCity:"${addressCity}",
            addressCountry:"${addressCountry}",
            addressPostalCode:"${addressPostalCode}",
            addressPrimary:${addressPrimary}
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserAddress).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserAddress, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddProfileImage = () => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding profileImage for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {addUserProfileImage(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            profileImageName:"${profileImageName}",
            profileImageType:"${profileImageType}",
            profileImagePath:"${profileImagePath}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.addUserProfileImage).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserProfileImage, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteProfileImage = () => {
    this.setState({ deleting: true, userAlert: "deleting profileImage for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {deleteUserProfileImage(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            profileImageName:"${profileImageName}",
            profileImageType:"${profileImageType}",
            profileImagePath:"${profileImagePath}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserProfileImage).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserProfileImage, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddSocialMedia = () => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding socialMedia for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {addUserSocialMedia(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            socialMediaPlatform:"${socialMediaPlatform}",
            socialMediaHandle:"${socialMediaHandle}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.addUserSocialMedia).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserSocialMedia, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteSocialMedia = () => {
    this.setState({ deleting: true, userAlert: "deleting socialMedia for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {deleteUserSocialMedia(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            socialMediaPlatform:"${socialMediaPlatform}",
            socialMediaHandle:"${socialMediaHandle}"
          })
          {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserSocialMedia).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserSocialMedia, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddPaymentInfo = () => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding paymentInfo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {addUserPaymentInfo(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            paymentInfoDate:"${paymentInfoDate}",
            paymentInfoType:"${paymentInfoType}",
            paymentInfoDescription:"${paymentInfoDescription}",
            paymentInfoBody:"${paymentInfoBody}",
            paymentInfoValid:${paymentInfoValid},
            paymentInfoPrimary:${paymentInfoPrimary},
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.addUserPaymentInfo).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserPaymentInfo, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeletePaymentInfo = () => {
    this.setState({ deleting: true, userAlert: "deleting paymentInfo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {deleteUserPaymentInfo(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            paymentInfoDate:"${paymentInfoDate}",
            paymentInfoType:"${paymentInfoType}",
            paymentInfoDescription:"${paymentInfoDescription}",
            paymentInfoBody:"${paymentInfoBody}",
            paymentInfoValid:${paymentInfoValid},
            paymentInfoPrimary:${paymentInfoPrimary}
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserPaymentInfo).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserPaymentInfo, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddInterests = () => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding interest for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {addUserInterests(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            interests:"${interests}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.addUserInterests).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserInterests, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteInterest = () => {
    this.setState({ deleting: true, userAlert: "deleting interest for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {deleteUserInterest(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            interest:"${interest}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserInterest).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserInterest, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddTags = () => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding tags for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
      mutation {addUserTags(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          tags:"${tags}"
        })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.addUserTags).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserTags, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteTag = () => {
    this.setState({ adding: false, userAddField: null, userAlert: "deleting tag for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
      mutation {deleteUserTag(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          tag:"${tag}"
        })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserTag).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.deleteUserTag, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddPerk  = () => {
        this.setState({ adding: false, userAddField: null, userAlert: "adding perk for user..." });
        const token = this.context.token;
        const activityId = this.context.activityId;
        const perkId = this.context.selectedPerk._id;

        const requestBody = {
          query:`

          `};

        fetch('http://localhost:7077/graphql', {
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
              this.setState({userAlert: 'Failed!'});
            }
            return res.json();
          })
          .then(resData => {

            const responseAlert = JSON.stringify(resData.data.addUserPerk).slice(2,25);
            this.setState({userAlert: responseAlert, user: resData.data.addUserPerk, activityA: requestBody})
            this.context.user = this.state.user;
            // logUserActivity();
          })
          .catch(err => {
            this.setState({userAlert: err});
          });

      }
  userDeletePerk = () => {
    this.setState({ deleting: true, userAlert: "deleting perk for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`

      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserPerk).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserPerk, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddPromo  = () => {
        this.setState({ adding: false, userAddField: null, userAlert: "adding promo for user..." });
        const token = this.context.token;
        const activityId = this.context.activityId;
        const promoId = this.context.selectedPromo._id;

        const requestBody = {
          query:`

          `};

        fetch('http://localhost:7077/graphql', {
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
              this.setState({userAlert: 'Failed!'});
            }
            return res.json();
          })
          .then(resData => {

            const responseAlert = JSON.stringify(resData.data.addUserPromo).slice(2,25);
            this.setState({userAlert: responseAlert, user: resData.data.addUserPromo, activityA: requestBody})
            this.context.user = this.state.user;
            // logUserActivity();
          })
          .catch(err => {
            this.setState({userAlert: err});
          });

      }
  userDeletePromo = () => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`

      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.userDeletePromo).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.userDeletePromo, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  userSelectFriendRequest = (args) => {
    console.log(args);
    let requestingFriend = args;
    // let requestingFriend = null;
    // if (args.sender._id === this.context.activityId) {
    //   requestingFriend = args.receiver;
    // }
    // if (args.receiver._id === this.context.activityId) {
    //   requestingFriend = args.sender;
    // }

    this.setState({requestingFriend: requestingFriend});
  };
  userDeleteFriendRequest = (event) => {
    this.setState({ deleting: true, userAlert: "deleting friend request for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    // const receiverId =

    const requestBody = {
      query:`
      mutation {deleteFriendRequest(
        activityId:"${activityId}",
        date:"${date}",
        senderId:"${senderId}",
        receiverId:"${receiverId}"
      )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteFriendRequest).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteFriendRequest, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  userAddFriend = (event) => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding friend for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    const friendId = this.state.requestingFriend;

    const requestBody = {
      query:`
      mutation {addUserFriend(
        activityId:"${activityId}",
        userId:"${userId}",
        friendId:"${friendId}"
      )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.addUserFriend).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.addUserFriend, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userSelectFriend = (args) => {
    this.setState({userSelectedFriend: args});
  };

  userDeleteFriend = () => {
    this.setState({ deleting: true, userAlert: "deleting friend for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    const friendId = this.state.userSelectedFriend._id;


    const requestBody = {
      query:`
        mutation {deleteUserFriend(
          activityId:"${activityId}",
          userId:"${userId}",
          friendId:"${friendId}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserFriend).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserFriend, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteCartItem = () => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {deleteUserCartLesson(
          activityId:"${activityId}",
          userId:"${userId}",
          lessonId:"${lessonId}",
          dateAdded:"${dateAdded}",
          sessionDate:"${sessionDate}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserCartLesson).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserCartLesson, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteBookedLesson = () => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {deleteUserBookedLesson(
          activityId:"${activityId}",
          userId:"${userId}",
          lessonId:"${lessonId}",
          date:"${date}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserBookedLesson).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserBookedLesson, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  userDeleteLikedLesson = () => {
    this.setState({ deleting: true, userAlert: "deleting likeLesson for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
  };
  userDeleteAttendedLesson = () => {
    this.setState({ deleting: true, userAlert: "deleting attendedLesson for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
  };
  userDeleteTaughtLesson = () => {
    this.setState({ deleting: true, userAlert: "deleting taughtLesson for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
  };

  userDeleteOrder = () => {
    this.setState({ deleting: true, userAlert: "deleting order for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`

      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserOrder).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserOrder, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteReview = () => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`

      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserReview).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserReview, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  userCreateMessage = (event) => {

    this.setState({ adding: false });
    const token = this.context.token;
    const receiver = this.context.receiver;
    const receiverId = this.context.receiver._id;
    const receiverRole = this.context.receiver.role;
    const role = this.context.role;
    const activityId = this.context.activityId;
    const senderName = this.state.user.username;
    const date = new Date();
    const timeString1 = date.toISOString().slice(11,16);
    const timeString2 = date.toLocaleString().slice(11,16);
    const type = event.target.formGridTypeSelect.value;
    const subject = event.target.formGridSubject.value;
    const message = event.target.formGridMessage.value;
    const msgObject = {
      date: date,
      time: timeString2,
      type: type,
      senderName: senderName,
      subject: subject,
      message: message,
    };

    const requestBody = {
      query:`
        mutation {createMessage(
          activityId:"${activityId}",
          senderId:"${senderId}",
          receiverId:"${receiverId}",
          messageInput:{
            type:"${type}",
            subject:"${subject}",
            message:"${message}"
          })
        {_id,date,time,type,subject,sender{_id,username},receiver{_id,username},message,read}}
      `};

    this.sendSocketMessage(msgObject);

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {
        console.log("resData",resData.data.createMessage);
        const responseAlert = JSON.stringify(resData.data.createMessage).slice(2,25);;
        this.setState({ userAlert: responseAlert, activityA: requestBody});
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  userDeleteMessage = () => {
    this.setState({ deleting: true, userAlert: "deleting message for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
      mutation {deleteMessage(
        activityId:"${activityId}",
        messageId:"${messageId}",)
      {_id,date,time,type,subject,sender{_id,username},receiver{_id,username},message,read}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteMessage).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteMessage, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  getThisUser() {
    this.setState({ isLoading: true });
    const activityId = this.context.activityId;
    const requestBody = {
      query: `
        query {getThisUser(activityId:"${activityId}")
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
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
          if (this.isActive) {
          this.setState({ user: thisUser, isLoading: false, activityA: requestBody });
          }
          if (sessionStorage.getItem('token')) {
            this.setState({userAlert: "Welcome Back..."})
          }
          if (thisUser.name === "Lord-of-the-Manor"){
            this.setState({canDelete: true, userAlert: "Mi'Lord!!"})
          }
          // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  logUserActivity() {
    const activityId = this.context.activityId;
    const token = this.context.token;
    const today = new Date();
    const request = this.state.activityA;

    const requestBody = {
      query:`
          mutation {addUserActivity(
            activityId:"${activityId}",
            userId:"${userId}",
            userInput:{
              activityRequest:"${request}"
            })
          {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.addUserActivity).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserActivity})
        this.context.user = this.state.user;
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  userDeleteActivity = () => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    const requestBody = {
      query:`
        mutation {deleteUserActivity(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            activityDate:"${activityDate}",
            activityRequest:"${activityRequest}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:7077/graphql', {
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
          this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data.deleteUserActivity).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserActivity})
        this.context.user = this.state.user;
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  modalCancelHandler = () => {
    this.setState({ updating: false, updatingField: false, adding: false, userAddField: null  });
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


  sendSocketMessage (msgObject) {
    const message = msgObject;
    console.log("sending socket message  ",message);

    let conversationId = null;
    if (this.context.receiver === null || this.context.receiver === undefined) {
      console.log("select someone to msg 1st...");
      this.setState({userAlert: "select someone to msg 1st..."});
      return
    }
    else {
      conversationId = this.context.receiver._id;
    }

    this.socket.emit('send message', {
      room: 'msg'+conversationId,
      message: message
    });
    this.socket.on("MESSAGE_SENT", function(data) {
      addMessage(data)
    })
    const addMessage = data => {
      this.setState({ userAlert: data.msg})
    };
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        <AlertBox
          authId={this.context.activityId}
          alert={this.state.userAlert}
        />

        {this.state.overlay === true && (
          <LoadingOverlay
            status={this.state.overlayStatus}
          />
        )}
        <SidebarControl
          onShowSidebar={this.showSidebar}
          onHideSidebar={this.hideSidebar}
        />
        <Row>

        {this.state.sidebarShow === true &&
          this.state.user !== null && (
          <Col md={2} className="MasterCol1">
          <SidebarPage
            you={this.state.user}
            authId={this.context.activityId}
          />
          </Col>
        )}

        <Col md={this.state.mCol2Size} className="MasterCol2">
          <div className="containerProfile">
          {this.state.isLoading ? (
            <Spinner />
          ) : (
            <Row>
              <Col>
              {this.state.user !== null && (
                  <ThisUserProfile
                    user={this.state.user}
                    authId={this.context.activityId}
                    onCancel={this.modalCancelHandler}
                    canDelete={this.state.canDelete}

                    onStartUpdate={this.userEdit}
                    onStartUpdateField={this.startUpdateUserFieldHandler}
                    onStartAdd={this.startAddHandler}

                    onEdit={this.userEditBasic}
                    onEditField={this.userEditField}

                    userAddPoints={this.userAddPoints}

                    userAddAddress={this.userAddAddress}
                    userDeleteAddress={this.userDeleteAddress}

                    userAddProfileImage={this.userAddProfileImage}
                    userDeleteProfileImage={this.userDeleteProfileImage}

                    userAddSocialMedia={this.userAddSocialMedia}
                    userDeleteSocialMedia={this.userDeleteSocialMedia}

                    userAddPaymentInfo={this.userAddPaymentInfo}
                    userDeletePaymentInfo={this.userDeletePaymentInfo}

                    selectedPerk={this.context.selectedPerk}
                    userAddPerk={this.userAddPerk}
                    userDeletePerk={this.userDeletePerk}

                    selectedPromo={this.context.selectedPromo}
                    userAddPromo={this.userAddPromo}
                    userDeletePromo={this.userDeletePromo}

                    userAddInterests={this.userAddInterests}
                    userDeleteInterest={this.userDeleteInterest}

                    userAddTags={this.userAddTags}
                    userDeleteTag={this.userDeleteTag}

                    userDeleteFriendRequest={this.userDeleteFriendRequest}
                    selectUserFriendRequest={this.userSelectFriendRequest}
                    userDeleteFriend={this.userDeleteFriend}
                    userSelectFriend={this.userSelectFriend}
                    userAddFriend={this.userAddFriend}
                    userDeleteFriend={this.userDeleteFriend}

                    userDeleteCartItem={this.userDeleteCartItem}
                    userDeleteLikedLesson={this.userDeleteLikedLesson}
                    userDeleteBookedLesson={this.userDeleteBookedLesson}
                    userDeleteAttendedLesson={this.userDeleteAttendedLesson}
                    userDeleteTaughtLesson={this.userDeleteTaughtLesson}

                    userDeleteOrder={this.userDeleteOrder}
                    userDeleteReview={this.userDeleteReview}
                    userDeleteActivity={this.userDeleteActivity}

                    userCreateMessage={this.userCreateMessage}
                    userDeleteMessage={this.userDeleteMessage}

                    updating={this.state.updating}
                    updatingField={this.state.updatingField}
                    userAddField={this.state.userAddField}

                    selectedUser={this.context.selectedUser}
                    messageReceiver={this.context.receiver}
                    requestingFriend={this.state.requestingFriend}
                  />
                )}

              </Col>
            </Row>
              )}
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default UserProfile;
