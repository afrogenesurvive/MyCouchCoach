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
    userSelectedFriend: null,
    orderBillingAddress: null,
    orderShippingAddress: null,
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

  onStartUpdate = () => {
    this.setState({ updating: true, userAddField: 'basic' });
  };
  onStartUpdateField = () => {
    this.setState({ updating: true, updatingField: true });
  };
  onStartAdd = (args) => {
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

  startCartCheckout = () => {
    this.setState({creatingOrder: true})
  }
  cancelCartCheckout = () => {
    this.setState({creatingOrder: false})
  }

  userEditBasic = (event) => {
    this.setState({ updating: false, userAlert: "Updating selected Staff ..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    let contactEmail = event.target.formGridEmail.value;
    let password = event.target.formGridPassword.value;
    let name = event.target.formGridName.value;
    let username = event.target.formGridUsername.value;
    // let role = this.context.user.role;
    let dob = event.target.formGridDob.value;
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
            userId:"${userId}",
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
            {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
        `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
    };
  userEditField = (event) => {
      this.setState({ updatingField: false, userAlert: "Updating selected Staff by Field..." });
      const token = this.context.token;
      const activityId = this.context.activityId;
      let userId = activityId;
      let field = null;
      let query = event.target.formGridQuery.value;
      if (event.target.formGridFieldSelect.value === "select") {
        // field = event.target.formGridField.value;
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
            {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
        `};

      fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
        let userId = activityId;
        const points = event.target.formGridPoints.value;

        const requestBody = {
          query:`
            mutation {addUserPoints(
              activityId:"${activityId}",
              userId:"${userId}",
              userInput:{
                points:${points}
              })
              {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
          `};

        fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userAddAddress = (event) => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding address for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const addressType = event.target.formGridAddressType.value;
    const addressNumber = event.target.formGridAddressNumber.value;
    const addressStreet = event.target.formGridAddressStreet.value;
    const addressTown = event.target.formGridAddressTown.value;
    const addressCity = event.target.formGridAddressCity.value;
    const addressCountry = event.target.formGridAddressCountry.value;
    const addressPostalCode = event.target.formGridAddressPostalCode.value;

    if (
      addressType.trim().length === 0 ||
      addressNumber.trim().length === 0 ||
      addressStreet.trim().length === 0 ||
      addressTown.trim().length === 0 ||
      addressCity.trim().length === 0 ||
      addressCountry.trim().length === 0 ||
      addressPostalCode.trim().length === 0
    ) {
      console.log('blank fields detected.. please check your info and try again..');
      this.setState({userAlert: 'blank fields detected.. please check your info and try again..'})
      return
    }

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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteAddress = (args) => {
    console.log('userDeleteAddress...');
    this.setState({ deleting: true, userAlert: "deleting address for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const addressType = args.type;
    const addressNumber = args.number;
    const addressStreet = args.street;
    const addressTown = args.town;
    const addressCity = args.city;
    const addressCountry = args.country;
    const addressPostalCode = args.postalCode;
    const addressPrimary = args.primary;

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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  makeAddressPrimary = (args) => {
    console.log('makeAddressPrimary...');
    this.setState({ deleting: true, userAlert: "deleting address for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const addressType = args.type;
    const addressNumber = args.number;
    const addressStreet = args.street;
    const addressTown = args.town;
    const addressCity = args.city;
    const addressCountry = args.country;
    const addressPostalCode = args.postalCode;
    const addressPrimary = args.primary;

    const requestBody = {
      query:`
        mutation {setUserAddressPrimary(
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
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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

        const responseAlert = JSON.stringify(resData.data.setUserAddressPrimary).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.setUserAddressPrimary, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddProfileImage = (event) => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding profileImage for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const profileImageName = event.target.formGridFilename.value;
    const profileImageType = event.target.formGridFiletype.value;
    const profileImagePath = event.target.formGridFilepath.value;
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteProfileImage = (args) => {
    this.setState({ deleting: true, userAlert: "deleting profileImage for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const profileImageName = args.name;
    const profileImageType = args.type;
    const profileImagePath = args.path;

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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userAddSocialMedia = (event) => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding socialMedia for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const socialMediaPlatform = event.target.formGridPlatform.value;
    const socialMediaHandle = event.target.formGridHandle.value;
    const socialMediaLink = event.target.formGridLink.value;

    const requestBody = {
      query:`
        mutation {addUserSocialMedia(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            socialMediaPlatform:"${socialMediaPlatform}",
            socialMediaHandle:"${socialMediaHandle}",
            socialMediaLink:"${socialMediaLink}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteSocialMedia = (args) => {
    console.log('userDeleteSocialMedia');
    this.setState({ deleting: true, userAlert: "deleting socialMedia for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const socialMediaPlatform = args.platform;
    const socialMediaHandle = args.handle;
    const socialMediaLink = args.link

    const requestBody = {
      query:`
        mutation {deleteUserSocialMedia(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            socialMediaPlatform:"${socialMediaPlatform}",
            socialMediaHandle:"${socialMediaHandle}",
            socialMediaLink:"${socialMediaLink}"
          }){_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userAddPaymentInfo = (event) => {
    console.log('userAddPaymentInfo');
    this.setState({ adding: false, userAddField: null, userAlert: "adding paymentInfo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;

    const paymentInfoDate = event.target.paymentInfoDate.value;
    const paymentInfoType = event.target.formGridPaymentInfoType.value;
    const paymentInfoDescription = event.target.formGridDescription.value;
    const paymentInfoBody = event.target.formGridBody.value;
    let paymentInfoPrimary = event.target.formGridPaymentInfoPrimaryCheckbox.checked;
    const paymentInfoValid = true;

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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeletePaymentInfo = (args) => {
    console.log('userDeletePaymentInfo',JSON.stringify(args));
    this.setState({ deleting: true, userAlert: "deleting paymentInfo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const paymentInfoDate = args.date;
    const paymentInfoType = args.type;
    const paymentInfoDescription = args.description;
    const paymentInfoBody = args.body;
    const paymentInfoValid = args.valid;
    const paymentInfoPrimary = args.primary;

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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userAddInterests = (event) => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding interest for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const interests = event.target.formGridInterests.value;

    const requestBody = {
      query:`
        mutation {addUserInterests(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            interests:"${interests}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
        const activityLog = 'mutation_addUserInterests_origin_'+activityId+'_target_'+userId+'_body_'+interests+'';
        const responseAlert = JSON.stringify(resData.data.addUserInterests).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserInterests, activityA: activityLog})
        this.context.user = this.state.user;
        this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteInterest = (args) => {
    this.setState({ deleting: true, userAlert: "deleting interest for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const interest = args;

    const requestBody = {
      query:`
        mutation {deleteUserInterest(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            interest:"${interest}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userAddTags = (event) => {
    this.setState({ adding: false, userAddField: null, userAlert: "adding tags for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const tags = event.target.formGridTags.value;

    const requestBody = {
      query:`
      mutation {addUserTags(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          tags:"${tags}"
        })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteTag = (args) => {
    this.setState({ adding: false, userAddField: null, userAlert: "deleting tag for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const tag = args;

    const requestBody = {
      query:`
      mutation {deleteUserTag(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          tag:"${tag}"
        })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userAddPerk  = (event) => {
        this.setState({ adding: false, userAddField: null, userAlert: "adding perk for user..." });
        const token = this.context.token;
        const activityId = this.context.activityId;
        const perkId = this.context.selectedPerk._id;

        // const requestBody = {
        //   query:`
        //
        //   `};
        //
        ec2-3-81-110-166.compute-1.amazonaws.com/graphql
        //   method: 'POST',
        //   body: JSON.stringify(requestBody),
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: 'Bearer ' + token
        //   }
        // })
        //   .then(res => {
        //     if (res.status !== 200 && res.status !== 201) {
        //       throw new Error('Failed!');
        //       this.setState({userAlert: 'Failed!'});
        //     }
        //     return res.json();
        //   })
        //   .then(resData => {
        //
        //     const responseAlert = JSON.stringify(resData.data.addUserPerk).slice(2,25);
        //     this.setState({userAlert: responseAlert, user: resData.data.addUserPerk, activityA: requestBody})
        //     this.context.user = this.state.user;
        //     // logUserActivity();
        //   })
        //   .catch(err => {
        //     this.setState({userAlert: err});
        //   });

      }
  userDeletePerk = (args) => {
    this.setState({ deleting: true, userAlert: "deleting perk for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    // const requestBody = {
    //   query:`
    //
    //   `};
    //
    // fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
    //   method: 'POST',
    //   body: JSON.stringify(requestBody),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   }
    // })
    //   .then(res => {
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error('Failed!');
    //       this.setState({userAlert: 'Failed!'});
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //
    //     const responseAlert = JSON.stringify(resData.data.deleteUserPerk).slice(2,25);
    //     this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserPerk, activityA: requestBody})
    //     this.context.user = this.state.user;
    //     // logUserActivity();
    //   })
    //   .catch(err => {
    //     this.setState({userAlert: err});
    //   });
  };
  userAddPromo  = (event) => {
        this.setState({ adding: false, userAddField: null, userAlert: "adding promo for user..." });
        const token = this.context.token;
        const activityId = this.context.activityId;
        const promoId = this.context.selectedPromo._id;

        // const requestBody = {
        //   query:`
        //
        //   `};
        //
        // fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
        //   method: 'POST',
        //   body: JSON.stringify(requestBody),
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: 'Bearer ' + token
        //   }
        // })
        //   .then(res => {
        //     if (res.status !== 200 && res.status !== 201) {
        //       throw new Error('Failed!');
        //       this.setState({userAlert: 'Failed!'});
        //     }
        //     return res.json();
        //   })
        //   .then(resData => {
        //
        //     const responseAlert = JSON.stringify(resData.data.addUserPromo).slice(2,25);
        //     this.setState({userAlert: responseAlert, user: resData.data.addUserPromo, activityA: requestBody})
        //     this.context.user = this.state.user;
        //     // logUserActivity();
        //   })
        //   .catch(err => {
        //     this.setState({userAlert: err});
        //   });

      }
  userDeletePromo = (args) => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;


    // const requestBody = {
    //   query:`
    //
    //   `};
    //
    // fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
    //   method: 'POST',
    //   body: JSON.stringify(requestBody),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   }
    // })
    //   .then(res => {
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error('Failed!');
    //       this.setState({userAlert: 'Failed!'});
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //
    //     const responseAlert = JSON.stringify(resData.data.userDeletePromo).slice(2,25);
    //     this.setState({deleting: false, userAlert: responseAlert, user: resData.data.userDeletePromo, activityA: requestBody})
    //     this.context.user = this.state.user;
    //     // logUserActivity();
    //   })
    //   .catch(err => {
    //     this.setState({userAlert: err});
    //   });
  };
  userAcceptFriendRequest = (args) => {
    console.log('userAcceptFriendRequest...');

    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = args.receiver._id;
    const friendId = args.sender._id;

    const requestBody = {
      query:`
      mutation {addUserFriend(
        activityId:"${activityId}",
        userId:"${userId}",
        friendId:"${friendId}"
      )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
        const activityLog = 'mutation_addUserFriend_origin_'+activityId+'_target_'+userId+'_body_'+friendId+'';
        const responseAlert = JSON.stringify(resData.data.addUserFriend).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.addUserFriend, activityA: activityLog})
        this.context.user = this.state.user;
        this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
    // let requestingFriend = event;
    // let requestingFriend = null;
    // if (args.sender._id === this.context.activityId) {
    //   requestingFriend = args.receiver;
    // }
    // if (args.receiver._id === this.context.activityId) {
    //   requestingFriend = args.sender;
    // }
    // return
    // this.setState({requestingFriend: requestingFriend});
  };
  userRejectFriendRequest = (args) => {
    console.log('userRejectFriendRequest...');
    this.setState({ deleting: true, userAlert: "deleting friend request for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    const senderId = args.sender._id;
    const receiverId = args.receiver._id;
    const date = args.date;

    const requestBody = {
      query:`
      mutation {deleteFriendRequest(
        activityId:"${activityId}",
        senderId:"${senderId}",
        receiverId:"${receiverId}"
      )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
    let userId = activityId;
    const friendId = this.state.requestingFriend;

    const requestBody = {
      query:`
      mutation {addUserFriend(
        activityId:"${activityId}",
        userId:"${userId}",
        friendId:"${friendId}"
      )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteFriend = (args) => {
    this.setState({ deleting: true, userAlert: "deleting friend for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const friendId = this.state.userSelectedFriend._id;

    const requestBody = {
      query:`
        mutation {deleteUserFriend(
          activityId:"${activityId}",
          userId:"${userId}",
          friendId:"${friendId}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteCartItem = (args) => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const lessonId = args.lesson;
    const dateAdded = args.dateAdded;
    const sessionDate = args.sessionDate;

    const requestBody = {
      query:`
        mutation {deleteUserCartLesson(
          activityId:"${activityId}",
          userId:"${userId}",
          lessonId:"${lessonId}",
          dateAdded:"${dateAdded}",
          sessionDate:"${sessionDate}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteBookedLesson = (args) => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const date = args.date;
    const lessonId = args.ref;

    const requestBody = {
      query:`
        mutation {deleteUserBookedLesson(
          activityId:"${activityId}",
          userId:"${userId}",
          lessonId:"${lessonId}",
          date:"${date}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteLikedLesson = (args) => {
    this.setState({ deleting: true, userAlert: "deleting likeLesson for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
  };
  userDeleteAttendedLesson = (args) => {
    this.setState({ deleting: true, userAlert: "deleting attendedLesson for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
  };
  userDeleteTaughtLesson = (args) => {
    this.setState({ deleting: true, userAlert: "deleting taughtLesson for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
  };

  addAddressToOrder = (event) => {
    event.preventDefault();
    // const address = JSON.stringify(event);
    console.log(event.target.value.slice(9,16));
    let type = event.target.value.slice(9,16);
    if (type === 'Billing') {
      console.log('beep');
      this.setState({orderBillingAddress: event.target.value})
    }
    if (type === 'Shipping') {
      console.log('beep');
      this.setState({orderShippingAddress: event.target.value})
    }
  }
  // orderStripePayment = () => {
    // const userCartLessonSkus = user.cart.map(x => x.lesson.sku)
    // console.log(userCartLessonSkus);
  // }
  createOrder = (event) => {
    event.preventDefault();
    this.setState({ creatingOrder: false, userAlert: "creating order for user..." });

    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const buyerId = activityId;
    const receiverId = activityId;

    const type = event.target.formGridType.value;
    const totalA = event.target.formGridTotalA.value;
    const totalB = event.target.formGridTotalB.value;
    const taxDescription = event.target.formGridTaxDescription.value;
    const taxAmount = event.target.formGridTaxAmount.value;
    const description = event.target.formGridDescription.value;
    const notes = event.target.formGridNotes.value;
    const payment = event.target.formGridPayment.value;
    const shipping = event.target.formGridShipping.value;
    const billingAddressNumber = event.target.formGridBillingAddressNumber.value;
    const billingAddressStreet = event.target.formGridBillingAddressStreet.value;
    const billingAddressTown = event.target.formGridBillingAddressTown.value;
    const billingAddressCity = event.target.formGridBillingAddressCity.value;
    const billingAddressCountry = event.target.formGridBillingAddressCountry.value;
    const billingAddressPostalCode = event.target.formGridBillingAddressPostalCode.value;
    const shippingAddressNumber = event.target.formGridShippingAddressNumber.value;
    const shippingAddressStreet = event.target.formGridShippingAddressStreet.value;
    const shippingAddressTown = event.target.formGridShippingAddressTown.value;
    const shippingAddressCity = event.target.formGridShippingAddressCity.value;
    const shippingAddressCountry = event.target.formGridShippingAddressCountry.value;
    const shippingAddressPostalCode = event.target.formGridShippingAddressPostalCode.value;

    const requestBody = {
      query:`
        mutation {createOrder(
          activityId:"${activityId}",
          buyerId:"${buyerId}",
          receiverId:"${receiverId}",
          orderInput:{
            type:"${type}",
            totalA:${totalA},
            totalB:${totalB},
            taxDescription:"${taxDescription}",
            taxAmount:${taxAmount},
            description:"${description}",
            notes:"${notes}",
            payment:"${payment}",
            shipping:"${shipping}",
            billingAddressNumber:${billingAddressNumber},
            billingAddressStreet:"${billingAddressStreet}",
            billingAddressTown:"${billingAddressTown}",
            billingAddressCity:"${billingAddressCity}",
            billingAddressCountry:"${billingAddressCountry}",
            billingAddressPostalCode:"${billingAddressPostalCode}",
            shippingAddressNumber:${shippingAddressNumber},
            shippingAddressStreet:"${shippingAddressStreet}",
            shippingAddressTown:"${shippingAddressTown}",
            shippingAddressCity:"${shippingAddressCity}",
            shippingAddressCountry:"${shippingAddressCountry}",
            shippingAddressPostalCode:"${shippingAddressPostalCode}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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

        const responseAlert = JSON.stringify(resData.data.createOrder).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.createOrder, activityA: requestBody})
        this.context.user = this.state.user;
        // logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  userDeleteOrder = (args) => {
    this.setState({ deleting: true, userAlert: "deleting order for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const orderId = args;

    const requestBody = {
      query:`
        mutation {deleteUserOrder(
          activityId:"${activityId}",
          userId:"${userId}",
          orderId:"${orderId}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteReview = (args) => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const reviewId = args;

    const requestBody = {
      query:`
        mutation {deleteUserReview(
          activityId:"${activityId}",
          userId:"${userId}",
          reviewId:"${reviewId}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
    const senderId = activityId;
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

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteMessage = (args) => {
    this.setState({ deleting: true, userAlert: "deleting message for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    const messageId = args;

    const requestBody = {
      query:`
      mutation {deleteMessage(
        activityId:"${activityId}",
        messageId:"${messageId}",)
      {_id,date,time,type,subject,sender{_id,username},receiver{_id,username},message,read}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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

        let errors = null;
        if (
          resData.errors ||
          JSON.stringify(resData).slice(2,7) === 'error'
        ) {
          errors = JSON.stringify({...resData.errors});
          this.setState({userAlert: "Something went wrong!!!"+errors+""})
        }

          const thisUser = resData.data.getThisUser;
          // console.log(thisUser);
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
    console.log('logUserActivity...');
    this.setState({userAlert: 'logUserActivity...'})
    const activityId = this.context.activityId;
    const userId = activityId;
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
          {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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
  userDeleteActivity = (args) => {
    this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const activityDate = args.date;
    const activityRequest = args.request;

    const requestBody = {
      query:`
        mutation {deleteUserActivity(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            activityDate:"${activityDate}",
            activityRequest:"${activityRequest}"
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
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

                    onStartUpdate={this.onStartUpdate}
                    onStartUpdateField={this.onStartUpdateField}
                    onStartAdd={this.onStartAdd}

                    userEditBasic={this.userEditBasic}
                    userEditField={this.userEditField}
                    userAddPoints={this.userAddPoints}
                    userAddAddress={this.userAddAddress}
                    makeAddressPrimary={this.makeAddressPrimary}
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

                    userRejectFriendRequest={this.userRejectFriendRequest}
                    userAcceptFriendRequest={this.userAcceptFriendRequest}
                    userDeleteFriend={this.userDeleteFriend}
                    userSelectFriend={this.userSelectFriend}
                    userAddFriend={this.userAddFriend}
                    userDeleteFriend={this.userDeleteFriend}

                    userDeleteCartItem={this.userDeleteCartItem}
                    userDeleteLikedLesson={this.userDeleteLikedLesson}
                    userDeleteBookedLesson={this.userDeleteBookedLesson}
                    userDeleteAttendedLesson={this.userDeleteAttendedLesson}
                    userDeleteTaughtLesson={this.userDeleteTaughtLesson}

                    addAddressToOrder={this.addAddressToOrder}
                    orderBillingAddress={this.state.orderBillingAddress}
                    orderShippingAddress={this.state.orderShippingAddress}
                    startCartCheckout={this.startCartCheckout}
                    cancelCartCheckout={this.cancelCartCheckout}
                    createOrder={this.createOrder}
                    userDeleteOrder={this.userDeleteOrder}
                    userDeleteReview={this.userDeleteReview}
                    userDeleteActivity={this.userDeleteActivity}

                    userCreateMessage={this.userCreateMessage}
                    userDeleteMessage={this.userDeleteMessage}

                    updating={this.state.updating}
                    updatingField={this.state.updatingField}
                    userAddField={this.state.userAddField}
                    creatingOrder={this.state.creatingOrder}

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
