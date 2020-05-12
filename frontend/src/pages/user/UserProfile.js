// import S3 from 'react-aws-s3';
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
// import Tab from 'react-bootstrap/Tab';
// import Nav from 'react-bootstrap/Nav';

import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/AlertBox';
import Spinner from '../../components/Spinner/Spinner';
// import AttachmentViewer from '../../components/AttachmentViewer';
import LoadingOverlay from '../../components/LoadingOverlay';
import SidebarPage from '../Sidebar';
import SidebarControl from '../../components/SidebarControl';

import ThisUserProfile from '../../components/Users/thisUserProfile';
import ProfileLessonViewer from '../../components/ProfileLessonViewer';

import './Users.css';
import io from 'socket.io-client';

class UserProfile extends Component {
  state = {
    user: null,
    userCopy: null,
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
    profileLessonViewer: false,
    profileLessonViewerData: null,
    profileLessonType: null,
    showSessionState: false,
    showScheduleState: false,
    creatingSession: false,
    editingLesson: false,
    editingLessonField: false,
    editingSessionField: false,
    session: null,
    sessionBookedState: false,
    sessionAttendedState: false,
    meetingsLoaded: false,
    meetingSessions: [],
    sessionDetailViewer: false,
    showInstructorsState: false,
    showRequirementsState: false,
    showMaterialsState: false,
    showTagsState: false,
    showFilesState: false,
    showImagesState: false,
    showReviewsState: false,
    creatingReview: false,
    reviewLesson: null,
    messageReplying: false,
    replyTo: null,
    filter: {
      field: null,
      key: null,
      value: null
    },
  };

  isActive = true;
  static contextType = AuthContext;

  constructor(props){
      super(props);
      this.socket = io('http://localhost:9099');
      this.userCopy = null;
    }

  componentDidMount() {
    console.log('...user profile component mounted...');
    this.getThisUser();

    this.socket.emit('msg_subscribe', {user: this.context.activityId, room:'msg'+this.context.activityId});
    // this.socket.emit('msg_subscribe', 'msg'+conversationId);
    console.log("listening for pms...");
    this.socket.on('conversation private post', function(data) {
      console.log("you got a new message..",data);
      addMessage(data);
    });
    const addMessage = data => {
      this.setState({
        userAlert: `New Msg!!
          Fr:   ${data.message.senderName},
          Msg:   ${data.message.message}`})
    };

    this.userOnline();

  };

  getPocketVars () {
    console.log('...retriving pocketVars..');
    const token = this.context.token;
    const activityId = this.context.activityId;
    const requestBody = {
          query:`
            query {getPocketVars(
              activityId:"${activityId}")
            {pocketVariables}}
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
        // console.log('beep',resData.data.getPocketVars.pocketVariables,JSON.parse(resData.data.getPocketVars.pocketVariables));
        this.setState({userAlert: resData.data.getPocketVars.pocketVariables})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  getThisUser() {
    this.setState({ isLoading: true });
    const activityId = this.context.activityId;
    const requestBody = {
      query: `
        query {getThisUser(activityId:"${activityId}")
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},toTeachLessons{_id,title,category,price},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,sessionTitle,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:8088/graphql', {
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
          this.userCopy = thisUser;
          if (this.isActive) {
          this.setState({ user: thisUser, userCopy: thisUser, isLoading: false, activityA: JSON.stringify(requestBody) });
          }
          if (sessionStorage.getItem('token')) {
            this.setState({userAlert: "Welcome Back..."})
          }
          if (thisUser.name === "Lord-of-the-Manor"){
            this.setState({canDelete: true, userAlert: "Mi'Lord!!"})
          }
          // this.getPocketVars();
          // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };
  logUserActivity() {
    console.log('logUserActivity...');
    this.setState({userAlert: 'logUserActivity...'})
    const activityId = this.context.activityId;
    const userId = activityId;
    const token = this.context.token;
    // const today = new Date().toLocaleDateString();
    const request = this.state.activityA;
    // console.log(activityId,userId,request);
    const requestBody = {
      query:`
          mutation {addUserActivity(
            activityId:"${activityId}",
            userId:"${userId}",
            userInput:{
              activityRequest:"${request}"
            })
          {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
    console.log("sending socket message  ",'message',message,'this.socket',this.socket);
    this.setState({userAlert: "sending socket message  "+'message'+message+'this.socket'+this.socket})
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
  };
  userOnline () {
    console.log('...bringing user online...');
    this.setState({userAlert: 'bringing user online...'})
    const token = this.context.token;
    const activityId = this.context.activityId;
    const requestBody = {
      query:`
        mutation{userOnline(
          activityId:"${activityId}",
          userId:"${activityId}")
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
        // const responseAlert = JSON.stringify(resData.data.userOnline).slice(2,25);
        // this.context.user = ;
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  onStartUpdate = () => {
    this.setState({ updating: true, userAddField: 'basic' });
  };
  onStartUpdateField = () => {
    this.setState({ updating: true, updatingField: true });
  };
  onStartAdd = (args) => {
    this.setState({adding: true, userAddField: args})
  };
  addUserField = (args) => {
    this.setState({adding: true, userAddField: args})
  };
  startCreateMessage = () => {
    if (this.context.receiver === null) {
      this.setState({userAlert: "select a receiver 1st..."});
    }
    this.setState({adding: true, userAddField: "message"})
  };

  startCartCheckout = () => {
    this.setState({creatingOrder: true})
  };
  cancelCartCheckout = () => {
    this.setState({creatingOrder: false})
  };

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
            {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
        `};

    fetch('http://localhost:8088/graphql', {
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

        this.setState({ userAlert: responseAlert, user: updatedUser, activityA: JSON.stringify(requestBody)})
        // this.logUserActivity();
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
            {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
          const responseAlert = JSON.stringify(resData.data.updateUserByField).slice(2,25);
          this.setState({ userAlert: responseAlert, user: resData.data.updateUserByField, activityA: JSON.stringify(requestBody)})
          this.context.user = this.state.user;
          // this.logUserActivity();
        })
        .catch(err => {
          this.setState({userAlert: err});
        });
    };
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
              {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

            const responseAlert = JSON.stringify(resData.data.addUserPoints).slice(2,25);
            this.setState({userAlert: responseAlert, user: resData.data.addUserPoints, activityA: JSON.stringify(requestBody)})
            this.context.user = this.state.user;
            // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.addUserAddress).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserAddress, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserAddress).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserAddress, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
    // const addressPrimary = args.primary;

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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.setUserAddressPrimary).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.setUserAddressPrimary, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.addUserProfileImage).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserProfileImage, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserProfileImage).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserProfileImage, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.addUserSocialMedia).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserSocialMedia, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
          })
          {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserSocialMedia).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserSocialMedia, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.addUserPaymentInfo).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserPaymentInfo, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserPaymentInfo).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserPaymentInfo, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
        // const activityLog = 'mutation_addUserInterests_origin_'+activityId+'_target_'+userId+'_body_'+interests+'';
        const responseAlert = JSON.stringify(resData.data.addUserInterests).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserInterests, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserInterest).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserInterest, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.addUserTags).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.addUserTags, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserTag).slice(2,25);
        this.setState({userAlert: responseAlert, user: resData.data.deleteUserTag, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddPerk  = (event) => {
        // this.setState({ adding: false, userAddField: null, userAlert: "adding perk for user..." });
        // const token = this.context.token;
        // const activityId = this.context.activityId;
        // const perkId = this.context.selectedPerk._id;

        // const requestBody = {
        //   query:`
        //
        //   `};
        //
        // fetch('http://localhost:8088/graphql', {
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
        //     this.setState({userAlert: responseAlert, user: resData.data.addUserPerk, activityA: JSON.stringify(requestBody)})
        //     this.context.user = this.state.user;
        //     // this.logUserActivity();
        //   })
        //   .catch(err => {
        //     this.setState({userAlert: err});
        //   });

      };
  userDeletePerk = (args) => {
    // this.setState({ deleting: true, userAlert: "deleting perk for user..." });
    // const token = this.context.token;
    // const activityId = this.context.activityId;


    // const requestBody = {
    //   query:`
    //
    //   `};
    //
    // fetch('http://localhost:8088/graphql', {
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
    //     this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserPerk, activityA: JSON.stringify(requestBody)})
    //     this.context.user = this.state.user;
    //     // this.logUserActivity();
    //   })
    //   .catch(err => {
    //     this.setState({userAlert: err});
    //   });
  };
  userAddPromo  = (event) => {
        // this.setState({ adding: false, userAddField: null, userAlert: "adding promo for user..." });
        // const token = this.context.token;
        // const activityId = this.context.activityId;
        // const promoId = this.context.selectedPromo._id;

        // const requestBody = {
        //   query:`
        //
        //   `};
        //
        // fetch('http://localhost:8088/graphql', {
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
        //     this.setState({userAlert: responseAlert, user: resData.data.addUserPromo, activityA: JSON.stringify(requestBody)})
        //     this.context.user = this.state.user;
        //     // this.logUserActivity();
        //   })
        //   .catch(err => {
        //     this.setState({userAlert: err});
        //   });

      }
  userDeletePromo = (args) => {
    // this.setState({ deleting: true, userAlert: "deleting promo for user..." });
    // const token = this.context.token;
    // const activityId = this.context.activityId;


    // const requestBody = {
    //   query:`
    //
    //   `};
    //
    // fetch('http://localhost:8088/graphql', {
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
    //     this.setState({deleting: false, userAlert: responseAlert, user: resData.data.userDeletePromo, activityA: JSON.stringify(requestBody)})
    //     this.context.user = this.state.user;
    //     // this.logUserActivity();
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
        const responseAlert = JSON.stringify(resData.data.addUserFriend).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.addUserFriend, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
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
    // const date = args.date;

    const requestBody = {
      query:`
      mutation {deleteFriendRequest(
        activityId:"${activityId}",
        senderId:"${senderId}",
        receiverId:"${receiverId}"
      )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteFriendRequest).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteFriendRequest, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userAddFriend = (event) => {
    console.log("...adding friend for user...");
    this.setState({ adding: false, userAddField: null, userAlert: "...adding friend for user..." });
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.addUserFriend).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.addUserFriend, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userSelectFriend = (args) => {
    this.setState({userSelectedFriend: args});
    this.context.receiver = args;
  };
  userDeleteFriend = (args) => {
    console.log("...deleting friend for user...");
    this.setState({ deleting: true, userAlert: "...deleting friend for user..." });
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserFriend).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserFriend, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteCartItem = (args) => {
    console.log("...deleting cart item for user...");
    this.setState({ deleting: true, userAlert: "...deleting cart item for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    let userId = activityId;
    const lessonId = args.lesson._id;
    const dateAdded = args.dateAdded;
    const sessionDate = args.sessionDate;
    const sessionTitle = args.sessionTitle;
    // console.log(sessionDate,lessonId,sessionTitle);
    const requestBody = {
      query:`
        mutation {deleteUserCartLesson(
          activityId:"${activityId}",
          userId:"${userId}",
          lessonId:"${lessonId}",
          dateAdded:"${dateAdded}",
          sessionDate:"${sessionDate}",
          sessionTitle:"${sessionTitle}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserCartLesson).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserCartLesson, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteBookedLesson = (args) => {
    this.setState({ deleting: true, userAlert: "deleting booked kesson for user..." });
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
        console.log('resData',resData);
        const responseAlert = JSON.stringify(resData.data.deleteUserBookedLesson).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserBookedLesson, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteLikedLesson = (args) => {
    this.setState({ deleting: true, userAlert: "deleting likeLesson for user..." });
    const token = this.context.token;
    const activityId = this.context.activityId;
    const userId = activityId;
    const lessonId = args._id;

    const requestBody = {
      query:`
        mutation {deleteUserLikedLesson(
          activityId:"${activityId}",
          userId:"${userId}",
          lessonId:"${lessonId}"
        )
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserLikedLesson).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserLikedLesson, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteAttendedLesson = (args) => {
    console.log("...deleting attendedLesson for user...");
    this.setState({ deleting: true, userAlert: "...deleting attendedLesson for user..." });
    // const token = this.context.token;
    // const activityId = this.context.activityId;
  };
  userDeleteTaughtLesson = (args) => {
    console.log("...deleting taughtLesson for user...");
    this.setState({ deleting: true, userAlert: "...deleting taughtLesson for user..." });
    // const token = this.context.token;
    // const activityId = this.context.activityId;
  };
  addAddressToOrder = (event) => {
    console.log('...add address to order...');
    event.preventDefault();
    // const address = JSON.stringify(event);
    console.log(event.target.value.slice(9,16));
    let type = event.target.value.slice(9,16);
    if (type === 'Billing') {
      this.setState({orderBillingAddress: event.target.value})
    }
    if (type === 'Shipping') {
      this.setState({orderShippingAddress: event.target.value})
    }
  };
  orderStripePayment = () => {
    const userCartLessonSkus = this.state.user.cart.map(x => x.lesson.sku)
    console.log(userCartLessonSkus);
    // on failure returnor throw error
  }
  addMultipleBookings = () => {
    console.log("...adding multiple bookings...");
    this.setState({ userAlert: "...adding multiple bookings...", isLoading: true });

    const token = this.context.token;
    const activityId = this.context.activityId;
    const requestBody = {
      query:`
        mutation {addMultipleBookings(activityId:"${activityId}")
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
          // console.log(resData);
          if (resData.errors) {
            this.setState({userAlert: resData.errors[0].message, isLoading: false})
          }
          if (resData.data.addMultipleBookings !== null) {
            this.setState({user: resData.data.addMultipleBookings, isLoading: false})
          }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });

  };
  createOrder = (event) => {
    event.preventDefault();
    console.log("creating order for user...");
    this.setState({ creatingOrder: false, userAlert: "creating order for user..." });

    const token = this.context.token;
    const activityId = this.context.activityId;
    // let userId = activityId;
    const buyerId = activityId;
    const receiverId = activityId;

    const type = event.target.formGridType.value;
    const totalA = event.target.formGridTotalA.value;
    const totalB = event.target.formGridTotalB.value;
    // const totalC = event.target.formGridTotalC.value;
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
        // console.log(resData);
        // const responseAlert = JSON.stringify(resData.data.createOrder).slice(2,25);
        // this.setState({userAlert: responseAlert, user: resData.data.createOrder, activityA: JSON.stringify(requestBody)})
        // this.context.user = this.state.user;
        // this.logUserActivity();
        this.addMultipleBookings();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteOrder = (args) => {
    console.log("...deleting order for user...");
    this.setState({ deleting: true, userAlert: "...deleting order for user..." });
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserOrder).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserOrder, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteReview = (args) => {
    console.log("...deleting promo for user...");
    this.setState({ deleting: true, userAlert: "...deleting promo for user..." });
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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

        const responseAlert = JSON.stringify(resData.data.deleteUserReview).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteUserReview, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userCreateMessage = (event) => {
    event.preventDefault();
    console.log('...user create message ...');
    this.setState({ adding: false });
    const token = this.context.token;
    // const receiver = this.context.receiver;
    const receiverId = this.context.receiver._id;
    // const receiverRole = this.context.receiver.role;
    // const role = this.context.role;
    const activityId = this.context.activityId;
    const senderId = activityId;
    const senderName = this.state.user.username;
    const date = new Date();
    // const timeString1 = date.toLocaleDateString().slice(11,16);
    const timeString2 = date.toLocaleDateString().slice(11,16);
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
        // console.log("createMessage",resData.data.createMessage);
        const responseAlert = JSON.stringify(resData.data.createMessage).slice(2,25);;
        this.setState({ userAlert: responseAlert, activityA: JSON.stringify(requestBody), userAddField: null});
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  userDeleteMessage = (args) => {
    console.log("...deleting message for user...");
    this.setState({ deleting: true, userAlert: "...deleting message for user..." });
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

        const responseAlert = JSON.stringify(resData.data.deleteMessage).slice(2,25);
        this.setState({deleting: false, userAlert: responseAlert, user: resData.data.deleteMessage, activityA: JSON.stringify(requestBody)})
        this.context.user = this.state.user;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  onStartReply = (args) => {
    this.setState({messageReplying: true, replyTo: args});
  };
  onCancelReply = () => {
    this.setState({messageReplying: false, replyTo: null});
  };
  onReply = (event) => {
    event.preventDefault();
    console.log('...replying to message...', this.state.replyTo,event.target);
    this.setState({userAlert: '...replying to message...', messageReplying: false})

    const token = this.context.token;
    // const receiver = this.state.replyTo.sender;
    const receiverId = this.state.replyTo.sender._id;
    // const role = this.context.role;
    const activityId = this.context.activityId;
    const senderId = activityId;
    const senderName = this.state.user.username;
    const date = new Date();
    // const timeString1 = date.toLocaleDateString().slice(11,16);
    const timeString2 = date.toLocaleDateString().slice(11,16);
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
        console.log("reply Message",resData.data.createMessage);
        const responseAlert = JSON.stringify(resData.data.createMessage).slice(2,25);;
        this.setState({ userAlert: responseAlert, activityA: JSON.stringify(requestBody), replyTo: null});
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  userDeleteActivity = (args) => {
    console.log("...deleting activity for user...");
    this.setState({ deleting: true, userAlert: "...deleting activity for user..." });
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
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
  };
  hideSidebar = () => {
      this.setState({
        sidebarShow: false,
        mCol2Size: 11
      })
  };
  viewLessonDetails = (args) => {
    console.log('...retriving lesson details...');
    this.setState({useAlert: 'retriving lesson details', isLoading: true})
    const token = this.context.token;
    const activityId = this.context.activityId;
    let lessonId = null;
    if (args.lesson._id) {
      lessonId = args.lesson._id;
    }
    if (args.lesson.ref) {
      lessonId = args.lesson.ref._id;
    }

    const requestBody = {
      query:`
        query {getLessonById(
          activityId:"${activityId}",
          lessonId:"${lessonId}"
        )
        {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},sessions{title,date,time,limit,amount,booked{_id,username,bio,profileImages{name,type,path},socialMedia{platform,handle,link}},bookedAmount,attended{_id,username,bio,profileImages{name,type,path},socialMedia{platform,handle,link}},attendedAmount,inProgress,full,url},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
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
        const responseAlert = JSON.stringify(resData.data.getLessonById).slice(2,25);
        this.setState({userAlert: responseAlert, isLoading: false, profileLessonViewer: true, profileLessonViewerData: resData.data.getLessonById, profileLessonType: args.type})
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  closeProfileLessonView = () => {
    this.setState({profileLessonViewer: false, profileLessonViewerData: null})
  };

  toggleSessions = () => {
    if (this.state.showSessionState === false) {
      this.setState({showSessionState: true})
    } else {
      this.setState({showSessionState: false})
    }
  }
  toggleInstructors = () => {
    if (this.state.showInstructorsState === false) {
      this.setState({showInstructorsState: true})
    } else {
      this.setState({showInstructorsState: false})
    }
  }
  toggleSchedule = () => {
    if (this.state.showScheduleState === false) {
      this.setState({showScheduleState: true})
    } else {
      this.setState({showScheduleState: false})
    }
  }
  toggleRequirements = () => {
    if (this.state.showRequirementsState === false) {
      this.setState({showRequirementsState: true})
    } else {
      this.setState({showRequirementsState: false})
    }
  }
  toggleMaterials = () => {
    if (this.state.showMaterialsState === false) {
      this.setState({showMaterialsState: true})
    } else {
      this.setState({showMaterialsState: false})
    }
  }
  toggleReviews = () => {
    if (this.state.showReviewsState === false) {
      this.setState({showReviewsState: true})
    } else {
      this.setState({showReviewsState: false})
    }
  }
  toggleTags = () => {
    if (this.state.showTagsState === false) {
      this.setState({showTagsState: true})
    } else {
      this.setState({showTagsState: false})
    }
  }
  toggleImages = () => {
    if (this.state.showImagesState === false) {
      this.setState({showImagesState: true})
    } else {
      this.setState({showImagesState: false})
    }
  }
  toggleFiles = () => {
    if (this.state.showFilesState === false) {
      this.setState({showFilesState: true})
    } else {
      this.setState({showFilesState: false})
    }
  }

  startCreateSession = (args) => {
    this.setState({creatingSession: true})
  };
  cancelCreateSession = () => {
    this.setState({creatingSession: false})
  };
  createLessonSession = (event) => {
    console.log('creating new lesson session');
    this.setState({userAlert: 'creating new lesson session'});

    const activityId = this.context.activityId;
    // const userId = activityId;
    const lessonId = this.state.profileLessonViewerData._id;

    const sessionTitle = event.target.formGridTitle.value;
    // const sessionDate = new Date (event.target.patientReferralCalendarVisitDate.value.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    let sessionDate = event.target.CalendarDate.value;
    sessionDate = new Date(sessionDate).toLocaleDateString().slice(0,10);
    const sessionTime = event.target.formGridTime.value;
    const sessionLimit = event.target.formGridLimit.value;
    const sessionAmount = 0;

    const requestBody = {
      query: `
          mutation {addLessonSession(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              sessionTitle:"${sessionTitle}",
              sessionDate:"${sessionDate}",
              sessionTime:"${sessionTime}",
              sessionLimit:${sessionLimit},
              sessionAmount:${sessionAmount}
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{phone,phone2,email}},tags,sessions{title,date,time,limit,inProgress,full}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.addLessonBooking, isLoading: false});
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  };
  onStartEditLessonBasic = () => {
    this.setState({editingLesson: true})
  };
  cancelEditBasic = () => {
    this.setState({editingLesson: false})
  };
  editLessonBasic = (event) => {
    event.preventDefault();
    console.log('...editing lesson basic...');
    this.setState({editingLesson: false, userAlert: '...editing lesson basic...'})
    let activityId = this.context.activityId;
    // const creatorId = activityId;
    const lessonId = this.state.profileLessonViewerData._id;
    const token = this.context.token;

    const title = event.target.formGridTitle.value;
    const subtitle = event.target.formGridSubtitle.value;
    const duration = event.target.formGridDuration.value;
    const type = event.target.formGridType.value;
    const category = event.target.formGridCategory.value;
    const sku = event.target.formGridSku.value;
    const price = event.target.formGridPrice.value;
    const points = event.target.formGridPoints.value;
    const description = event.target.formGridDescription.value;
    const notes = event.target.formGridNotes.value;

    const requestBody = {
      query: `
       mutation {updateLessonBasic(
         activityId:"${activityId}",
         lessonId:"${lessonId}",
         lessonInput:{
           title:"${title}",
           subtitle:"${subtitle}",
           type:"${type}",
           category:"${category}",
           price:${price},
           sku:"${sku}",
           points:${points},
           description:"${description}",
           notes:"${notes}",
           duration:"${duration}"
         })
    {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{phone,phone2,email}},tags}}
    `}

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
        const responseAlert = JSON.stringify(resData.data.updateLessonBasic).slice(0,8);
        this.setState({ profileLessonViewerData: resData.data.updateLessonBasic, userAlert: responseAlert})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  onStartEditLessonField = () => {
    this.setState({editingLessonField: true})
  };
  cancelEditField = () => {
    this.setState({editingLessonField: false})
  };
  editLessonField = (event) => {
    event.preventDefault();
    console.log('...editing lesson field...');
    this.setState({editingLessonField: false, userAlert: '...editing lesson field...'})
    let activityId = this.context.activityId;
    // const creatorId = activityId;
    const lessonId = this.state.profileLessonViewerData._id;
    const token = this.context.token;

    const field = event.target.formGridFieldSelect.value;
    const query = event.target.formGridQuery.value;
    const requestBody = {
      query: `
         mutation {updateLessonByField(
           activityId:"${activityId}",
           lessonId:"${lessonId}",
           field:"${field}",
           query:"${query}"
         )
         {_id,title,subtitle,type,category,price,sku,points,description,notes,duration,schedule{date,time},instructors{_id,username},gallery{name,type,path},requirements,materials,files{name,type,size,path},reviews{_id,title,author{_id}},tags,sessions{title,date,time,limit,amount,booked{_id,username},bookedAmount,attended{_id,username},attendedAmount,inProgress,full},promos{_id}}}
          `}

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
        const responseAlert = JSON.stringify(resData.data.updateLessonByField).slice(0,8);
        this.setState({ profileLessonViewer: resData.data.updateLessonByField, userAlert: responseAlert})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  startEditSessionField = (args) => {
    this.setState({editingSessionField: true, session: args})
  };
  cancelEditSessionField = () => {
    this.setState({editingSessionField: false})
  };
  editSessionField = (event) => {
    event.preventDefault();
    console.log(event, '...updating session by field...');
    this.setState({editingSessionField: false, userAlert: '...updating session by field...'})
    let activityId = this.context.activityId;
    // const creatorId = activityId;
    // const lessonId = this.state.session.lessonId;
    let lessonId = null;
    if (this.state.sessionDetailViewer === true ) {
      lessonId = this.state.session.lessonId;
    } else {
      lessonId = this.state.profileLessonViewerData._id;
    }
    const token = this.context.token;

    const sessionTitle = this.state.session.title;
    const sessionDate = this.state.session.date;

    const sessionField = event.target.formGridFieldSelect.value;
    const sessionQuery = event.target.formGridQuery.value;
    const requestBody = {
      query: `
        mutation {updateSessionField(
          activityId:"${activityId}",
          lessonId:"${lessonId}",
          lessonInput:{
            sessionTitle:"${sessionTitle}",
            sessionDate:"${sessionDate}",
            sessionField:"${sessionField}",
            sessionQuery:"${sessionQuery}"
          })
         {_id,title,subtitle,type,category,price,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{email,phone,phone2}},gallery{name,type,path},requirements,materials,files{name,type,size,path},reviews{_id},tags,sessions{title,date,time,limit,amount,booked{_id,username},bookedAmount,attended{_id,username},attendedAmount,inProgress,full,url},promos{_id}}}
          `}

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
        const lesson = resData.data.updateSessionField;
        const sessions = resData.data.updateSessionField.sessions;
        const session = sessions.filter(x => x.title === sessionTitle)
        const session2 = session[0];
        console.log(session);
        const newSession = {
            title: session2.title,
            date: session2.date,
            time: session2.time,
            limit: session2.limit,
            amount: session2.amount,
            bookedAmount: session2.bookedAmount,
            booked: session2.booked,
            attended: session2.attended,
            attendedAmount: session2.attendedAmount,
            inProgress: session2.inProgress,
            full: session2.full,
            url: session2.url,
            lessonId: lesson._id,
            lessonTitle: lesson.title,
            lessonInstructors: lesson.instructors,
          };
        const responseAlert = JSON.stringify(resData.data.updateSessionField).slice(0,8);
        this.setState({ sessionDetailViewer: true, session: newSession, profileLessonViewerData: resData.data.updateSessionField, userAlert: responseAlert})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });

  };

  showSessionBooked = () => {
    this.setState({sessionBookedState: true})
  };
  showSessionAttended = () => {
    console.log("...attended session attendance...");
    this.setState({sessionAttendedState: true})
  };
  hideSessionBooked = () => {
    this.setState({sessionBookedState: false})
  };
  hideSessionAttended = () => {
    this.setState({sessionAttendedState: false})
  };
  addSessionAttendance = (attendance) => {
    console.log('...adding session attendance...');
    this.setState({userAlert: '...adding session attendance...'})
    const activityId = this.context.activityId;
    const userId = attendance.user._id;
    let lessonId = null;
    if (this.state.sessionDetailViewer === true ) {
      lessonId = this.state.session.lessonId;
    } else {
      lessonId = this.state.profileLessonViewerData._id;
    }

    const sessionDate = attendance.sessionDate;
    const sessionTitle = attendance.sessionTitle;

    const requestBody = {
      query: `
          mutation {addLessonAttendance(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            userId:"${userId}",
            lessonInput:{
              sessionTitle:"${sessionTitle}",
              sessionDate:"${sessionDate}"
            })
            {_id,title,subtitle,type,category,price,points,description,notes,duration,schedule{date,time},instructors{_id,username,contact{email,phone,phone2}},gallery{name,type,path},requirements,materials,files{name,type,size,path},reviews{_id},tags,sessions{title,date,time,limit,amount,booked{_id,username},bookedAmount,attended{_id,username},attendedAmount,inProgress,full,url},promos{_id}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.addLessonAttendance});
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };

  loadMeetings = () => {
    console.log('...retriving todays sessions...');
    this.setState({userAlert: '...retriving todays sessions...'})
    const activityId = this.context.activityId;

    const requestBody = {
      query: `
          query {getUserBookedSessionsToday(
            activityId:"${activityId}"
          )
          {title,date,time,limit,amount,bookedAmount,attendedAmount,inProgress,full,url,lessonId,lessonTitle,lessonInstructors,userId}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData.data.getUserBookedSessionsToday);
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, meetingSessions: resData.data.getUserBookedSessionsToday, meetingsLoaded: true});
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  hideMeetings = () => {
    this.setState({ meetingsLoaded: false, meetingSessions: []})
  };
  viewSessionDetails = (session) => {
    console.log('...rerieving session details...');
    this.setState({userAlert: '...retriving todays sessions...'})
    const activityId = this.context.activityId;
    const lessonId = session.lessonId;
    const sessionTitle = session.title;
    const sessionDate = session.date;

      const requestBody = {
        query: `
          query {getLessonSession(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              sessionTitle:"${sessionTitle}",
              sessionDate:"${sessionDate}"
            })
            {title,date,time,limit,amount,bookedAmount,booked{_id,username},attendedAmount,attended{_id,username},inProgress,full,url,lessonId,lessonTitle,lessonInstructors,userId}}
        `}

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData.data.getLessonSession);
        const newSession = {
          title: resData.data.getLessonSession.title,
          date: resData.data.getLessonSession.date,
          time: resData.data.getLessonSession.time,
          limit: resData.data.getLessonSession.limit,
          amount: resData.data.getLessonSession.amount,
          bookedAmount: resData.data.getLessonSession.bookedAmount,
          booked: resData.data.getLessonSession.booked,
          attended: resData.data.getLessonSession.attended,
          attendedAmount: resData.data.getLessonSession.attendedAmount,
          inProgress: resData.data.getLessonSession.inProgress,
          full: resData.data.getLessonSession.full,
          url: resData.data.getLessonSession.url,
          lessonId: session.lessonId,
          lessonTitle: session.lessonTitle,
          lessonInstructors: session.lessonInstructors,
        };
        // console.log('beep',newSession);
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, session: newSession, sessionDetailViewer: true});
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  hideSessionDetails = () => {
    this.setState({session: null, sessionDetailViewer: false})
  };

  startCreateReview = (args) => {
    console.log('startCreateReview', args);
    this.setState({creatingReview: true, reviewLesson: args.ref})
  }
  cancelCreateReview = () => {
    this.setState({creatingReview: false, reviewLesson: null})
  }
  createReview = (event) => {
    event.preventDefault();
    console.log('...createing review...');
    this.setState({userAlert: '...createing review...', creatingReview: false})
    const lessonId = this.state.reviewLesson._id;
    const activityId = this.context.activityId;
    const userId = activityId;
    const type = event.target.formGridTypeSelect.value;
    const title = event.target.formGridTitle.value;
    const body = event.target.formGridBody.value;
    const rating = event.target.formGridRating.value;
    //
    const requestBody = {
      query: `
        mutation {createReview(
          activityId:"${activityId}",
          userId:"${userId}",
          lessonId:"${lessonId}",
          reviewInput:{
            type:"${type}",
            title:"${title}",
            body:"${body}",
            rating:${rating}
          })
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData.data.createReview);
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, user: resData.data.createReview, reviewLesson: null});
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  startLessonAdd = (args) => {
    // console.log(args);
    this.setState({lessonAddField: args})
  }
  cancelLessonAdd = (args) => {
    this.setState({lessonAddField: null})
  }

  addLessonMaterials = (event) => {
    event.preventDefault();
    console.log('...adding lesson materials...');
    this.setState({userAlert: '...adding lesson materials...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;

    const materials = event.target.formGridMaterials.value;

    const requestBody = {
      query: `
          mutation {addLessonMaterials(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              materials: "${materials}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData.data);
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, activityA: requestBody, profileLessonViewerData: resData.data.addLessonMaterials});
        // this.context.selectedLesson = this.state.selectedLesson;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  addLessonTags = (event) => {
    event.preventDefault();
    console.log('...adding lesson tags...');
    this.setState({userAlert: '...adding lesson tags...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;

    const tags = event.target.formGridTags.value;

    const requestBody = {
      query: `
          mutation {addLessonTags(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              tags:"${tags}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, activityA: requestBody, profileLessonViewerData: resData.data.addLessonTags});
        // this.context.selectedLesson = this.state.selectedLesson;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  addLessonRequirements = (event) => {
    event.preventDefault();
    console.log('...adding lesson requirements ...');
    this.setState({userAlert: '...adding lesson requirements ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;

    const requirements = event.target.formGridRequirements.value;

    const requestBody = {
      query: `
          mutation {addLessonRequirements(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              requirements: "${requirements}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, activityA: requestBody, profileLessonViewerData: resData.data.addLessonRequirements});
        // this.context.selectedLesson = this.state.selectedLesson;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  addLessonImage = (event) => {
    event.preventDefault();
    console.log('...adding lesson Image ...');
    this.setState({userAlert: '...adding lesson Images ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;

    const imageName = event.target.formGridImagename.value;
    const imageType = event.target.formGridImagetype.value;
    const imagePath = event.target.formGridImagepath.value;

    const requestBody = {
      query: `
          mutation {addLessonImage(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              imageName:"${imageName}",
              imageType:"${imageType}",
              imagePath:"${imagePath}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log('resData.data.addLessonImage',resData.data.addLessonImage);
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.addLessonImage, activityA: requestBody});
        // this.context.selectedLesson = this.state.selectedLesson;
        // this.logUserActivity();
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });

  }
  addLessonFile = (event) => {
    event.preventDefault();
    console.log('...adding lesson Files ...');
    this.setState({userAlert: '...adding lesson Files ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;

    const fileName = event.target.formGridFilename.value;
    const fileType = event.target.formGridFilesize.value;
    const fileSize = event.target.formGridFiletype.value;
    const filePath = event.target.formGridFilepath.value;

    const requestBody = {
      query: `
          mutation {addLessonFile(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              fileName: "${fileName}"
              fileType: "${fileType}"
              fileSize: "${fileSize}"
              filePath: "${filePath}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, activityA: requestBody, profileLessonViewerData: resData.data.addLessonFile});
        // this.context.selectedLesson = this.state.selectedLesson;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });

  }
  addLessonInstructor = (event) => {
    event.preventDefault();
    console.log('...adding lesson instructor ...');
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const instructorId = this.context.selectedUser._id;
    const lessonId = this.state.profileLessonViewerData._id;

    const requestBody = {
      query: `
          mutation {addLessonInstructor(
            activityId:"${activityId}",
            lessonId:"${lessonId}"
            instructorId: "${instructorId}")
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, activityA: requestBody, profileLessonViewerData: resData.data.addLessonInstructor});
        // this.context.selectedLesson = this.state.selectedLesson;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });

  }

  deleteLessonTag = (args) => {
    console.log('...deleting lesson tag...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;
    const tag = args;

    const requestBody = {
      query: `
          mutation {deleteLessonTag(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              tag:"${tag}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData.data.deleteLessonTag);
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.deleteLessonTag, activityA: requestBody});
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonRequirement = (args) => {
    console.log('...deleting lesson requirement...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;
    const requirement = args;

    const requestBody = {
      query: `
          mutation {deleteLessonRequirement(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              requirement:"${requirement}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.deleteLessonRequirement, activityA: requestBody});
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonMaterial = (args) => {
    console.log('...deleting lesson material...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;
    const material = args;

    const requestBody = {
      query: `
          mutation {deleteLessonMaterial(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              material:"${material}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.deleteLessonMaterial, activityA: requestBody});
        // this.context.selectedLesson = this.state.selectedLesson;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonImage = (args) => {
    console.log('...deleting lesson image...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;
    const imageName = args.name;
    const imageType = args.type;
    const imagePath = args.path;

    const requestBody = {
      query: `
          mutation {deleteLessonImage(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              imageName: "${imageName}",
              imageType: "${imageType}",
              imagePath: "${imagePath}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.deleteLessonImage, activityA: requestBody});
        // this.context.selectedLesson = this.state.selectedLesson;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonFile = (args) => {
    console.log('...deleting lesson file...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;

    const fileName = args.name;
    const fileType = args.type;
    const fileSize = args.size;
    const filePath = args.path;

    const requestBody = {
      query: `
          mutation {deleteLessonFile(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            lessonInput:{
              fileName: "${fileName}",
              fileType: "${fileType}",
              fileSize: "${fileSize}",
              filePath: "${filePath}"
            })
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.deleteLessonFile, activityA: requestBody});
        // this.context.selectedLesson = this.state.selectedLesson;
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }
  deleteLessonInstructor = (args) => {
    console.log('...deleting lesson instructor...',args);
    this.setState({userAlert: '...adding lesson instructor ...', lessonAddField: null });
    const activityId = this.context.activityId;
    const lessonId = this.state.profileLessonViewerData._id;
    const instructorId = args._id;

    const requestBody = {
      query: `
          mutation {deleteLessonInstructor(
            activityId:"${activityId}",
            lessonId:"${lessonId}",
            instructorId: "${instructorId}"
          )
            {_id,title,subtitle,type,category,price,sku,points,description,notes,requirements,materials,duration,files{name,type,size,path},gallery{name,type,path},schedule{date,time},gallery{name,type,path},instructors{_id,username,contact{phone,phone2,email},socialMedia{platform,handle,link},profileImages{name,type,path}},tags,reviews{_id,title,type,author{_id,username},lesson{_id,title},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(0,8);
        this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.deleteLessonInstructor, activityA: requestBody});
        // this.logUserActivity();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  cancelSessionBooking = (args) => {
    console.log('...cancelling session...',args);

    // this.setState({userAlert: '...cancelling lesson booking ...' });
    // const activityId = this.context.activityId;
    // const lessonId = this.state.profileLessonViewerData._id;
    //
    // const requestBody = {
    //   query: `
    //
    //     `};
    //
    // fetch('http://localhost:8088/graphql', {
    //   method: 'POST',
    //   body: JSON.stringify(requestBody),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + this.context.token
    //   }
    // })
    //   .then(res => {
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error('Failed!');
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     const responseAlert = JSON.stringify(resData.data).slice(0,8);
    //     this.setState({userAlert: responseAlert, profileLessonViewerData: resData.data.deleteLessonInstructor, activityA: requestBody});
    //     // this.logUserActivity();
    //   })
    //   .catch(err => {
    //     this.setState({userAlert: err});
    //     if (this.isActive) {
    //       this.setState({ isLoading: false });
    //     }
    //   });

  }


  clearAddressFilters = () => {
    this.setState({filter: {
      field: null,
      key: null,
      value: null
    },
      userAlert: '..filters cleared..'
  })
}
  setFilter = (args) => {
    // console.log('...set filter...',{...args});
    this.setState({filter: {
      field: args.field,
      key: args.key,
      value: args.value
    }});
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

        {this.state.profileLessonViewer === true &&
          this.state.profileLessonViewerData !== null && (
          <ProfileLessonViewer
            authId={this.context.activityId}
            lessonType={this.state.profileLessonType}
            profileLesson={this.state.profileLessonViewerData}
            closeProfileLessonView={this.closeProfileLessonView}

            toggleSessions={this.toggleSessions}
            showSessionState={this.state.showSessionState}

            showScheduleState={this.state.showScheduleState}
            toggleSchedule={this.toggleSchedule}

            toggleInstructors={this.toggleInstructors}
            showInstructorsState={this.state.showInstructorsState}
            toggleRequirements={this.toggleRequirements}
            showRequirementsState={this.state.showRequirementsState}
            toggleMaterials={this.toggleMaterials}
            showMaterialsState={this.state.showMaterialsState}
            toggleReviews={this.toggleReviews}
            showReviewsState={this.state.showReviewsState}

            toggleTags={this.toggleTags}
            showTagsState={this.state.showTagsState}
            toggleImages={this.toggleImages}
            showImagesState={this.state.showImagesState}
            toggleFiles={this.toggleFiles}
            showFilesState={this.state.showFilesState}

            startCreateSession={this.startCreateSession}
            creatingSession={this.state.creatingSession}
            cancelCreateSession={this.cancelCreateSession}
            createLessonSession={this.createLessonSession}

            startEditSessionField={this.startEditSessionField}
            editingSessionField={this.state.editingSessionField}
            editSessionField={this.editSessionField}
            cancelEditSessionField={this.cancelEditSessionField}
            session={this.state.session}

            showSessionBooked={this.showSessionBooked}
            showSessionAttended={this.showSessionAttended}
            hideSessionBooked={this.hideSessionBooked}
            hideSessionAttended={this.hideSessionAttended}
            sessionBookedState={this.state.sessionBookedState}
            sessionAttendedState={this.state.sessionAttendedState}
            addSessionAttendance={this.addSessionAttendance}
            cancelSessionBooking={this.cancelSessionBooking}

            editingLesson={this.state.editingLesson}
            onStartEditLessonBasic={this.onStartEditLessonBasic}
            editLessonBasic={this.editLessonBasic}
            cancelEditBasic={this.cancelEditBasic}

            editingLessonField={this.state.editingLessonField}
            onStartEditLessonField={this.onStartEditLessonField}
            editLessonField={this.editLessonField}
            cancelEditField={this.cancelEditField}

            startLessonAdd={this.startLessonAdd}
            cancelLessonAdd={this.cancelLessonAdd}
            lessonAddField={this.state.lessonAddField}
            addLessonMaterials={this.addLessonMaterials}
            addLessonRequirements={this.addLessonRequirements}
            addLessonTags={this.addLessonTags}
            addLessonInstructor={this.addLessonInstructor}
            addLessonImage={this.addLessonImage}
            addLessonFile={this.addLessonFile}
            selectedInstructor={this.context.selectedUser}

            deleteLessonTag={this.deleteLessonTag}
            deleteLessonRequirement={this.deleteLessonRequirement}
            deleteLessonMaterial={this.deleteLessonMaterial}
            deleteLessonImage={this.deleteLessonImage}
            deleteLessonFile={this.deleteLessonFile}
            deleteLessonInstructor={this.deleteLessonInstructor}
          />
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
                    user={this.userCopy}
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
                    onStartCreateMessage={this.startCreateMessage}

                    viewLessonDetails={this.viewLessonDetails}

                    loadMeetings={this.loadMeetings}
                    hideMeetings={this.hideMeetings}
                    meetingsLoaded={this.state.meetingsLoaded}
                    meetingSessions={this.state.meetingSessions}
                    viewSessionDetails={this.viewSessionDetails}
                    hideSessionDetails={this.hideSessionDetails}
                    sessionDetailViewer={this.state.sessionDetailViewer}

                    startEditSessionField={this.startEditSessionField}
                    editingSessionField={this.state.editingSessionField}
                    editSessionField={this.editSessionField}
                    cancelEditSessionField={this.cancelEditSessionField}
                    session={this.state.session}

                    showSessionBooked={this.showSessionBooked}
                    showSessionAttended={this.showSessionAttended}
                    hideSessionBooked={this.hideSessionBooked}
                    hideSessionAttended={this.hideSessionAttended}
                    sessionBookedState={this.state.sessionBookedState}
                    sessionAttendedState={this.state.sessionAttendedState}
                    addSessionAttendance={this.addSessionAttendance}

                    startCreateReview={this.startCreateReview}
                    cancelCreateReview={this.cancelCreateReview}
                    creatingReview={this.state.creatingReview}
                    reviewLesson={this.state.reviewLesson}
                    createReview={this.createReview}

                    messageReplying={this.state.messageReplying}
                    onStartReply={this.onStartReply}
                    onCancelReply={this.onCancelReply}
                    onReply={this.onReply}
                    replyTo={this.state.replyTo}

                    filter={this.state.filter}
                    setFilter={this.setFilter}
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
