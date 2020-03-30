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
import io from 'socket.io-client';

class UserProfile extends Component {
  state = {
    user: null,
    users: [],
    updating: false,
    adding: false,
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
  };

  isActive = true;
  static contextType = AuthContext;

  constructor(props){
      super(props);

      this.socket = io('http://localhost:9007');
      // // this.socket.on('anyone out there?', function (data) {
      // //   console.log(data);
      // // });
      // // this.socket.on('here i am', function (data) {
      // //   console.log(data);
      // // });
      // this.socket.on('RECEIVE_MESSAGE', function(data){
      //     console.log(data);
      //       addMessage(data);
      //   });
      //   const addMessage = data => {
      //     console.log("you got msg");
      //       this.context
      //   };

    }


  componentDidMount() {
    this.getThisUser();
    const conversationId = this.context.activityId;
    this.socket.emit('msg_subscribe', 'msg'+conversationId);
    this.socket.emit('trans_subscribe', 'trans'+conversationId);
    console.log("listening for tokens & pms...");

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

    this.socket.on('conversation private transaction', function(data) {
      console.log("you got tokens..",data);
      addTransaction(data);
    });
    const addTransaction = data => {
      this.setState({
        userAlert: `New Tokens!!
          Fr:   ${data.transaction.senderName},
          Amnt:  + ${data.transaction.amount}
          refresh page??`
        });
        // this.getThisUser();
    };

  }

  startUpdateUserHandler = () => {
    this.setState({ updating: true });
  };
  startUpdateUserFieldHandler = () => {
    this.setState({ updatingField: true });
  };

  modalConfirmUpdateHandler = (event) => {

    const token = this.context.token;
    const activityId = this.context.activityId;

    this.setState({ updating: false, userAlert: "Updating selected Staff ..." });
    let contactEmail = event.target.formGridEmail.value;
    let password = event.target.formGridPassword.value;
    let name = event.target.formGridName.value;
    let username = event.target.formGridUsername.value;
    let role = this.context.user.role;
    let dob = event.target.formGridDob.value;

    let contactPhone = event.target.formGridPhone.value;
    let addressNumber = event.target.formGridAddressNumber.value;
    let addressStreet = event.target.formGridAddressStreet.value;
    let addressTown = event.target.formGridAddressTown.value;
    let addressCity = event.target.formGridAddressCity.value;
    let addressCountry = event.target.formGridAddressCountry.value;
    let addressPostalCode = event.target.formGridAddressPostalCode.value;
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
    if (contactPhone.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      contactPhone = this.context.user.contact.phone;
    }
    if (addressNumber.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      addressNumber = this.context.user.address.number;
    }
    if (addressStreet.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      addressStreet = this.context.user.address.street;
    }
    if (addressTown.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      addressTown = this.context.user.address.town;
    }
    if (addressCity.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      addressCity = this.context.user.address.city;
    }
    if (addressCountry.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      addressCountry = this.context.user.address.country;
    }
    if (addressPostalCode.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      addressPostalCode = this.context.user.address.postalCode;
    }
    if (bio.trim().length === 0) {
      this.setState({ userAlert: "blank fields detected!!!...filling w/ previous data..."});
      bio = this.context.user.bio;
    }

    const requestBody = {
      query: `
          mutation {updateUser(
            activityId:"${activityId}",
            userId:"${activityId}",
          userInput:{
            password:"${password}",
            name:"${name}",
            username:"${username}",
            role:"${role}",
            dob:"${dob}",
            addressNumber:${addressNumber},
            addressStreet:"${addressStreet}",
            addressTown:"${addressTown}",
            addressCity:"${addressCity}",
            addressCountry:"${addressCountry}",
            addressPostalCode:"${addressPostalCode}",
            contactPhone:"${contactPhone}",
            contactEmail:"${contactEmail}",
            bio:"${bio}"
          })
          {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
        const updatedUser = resData.data.updateUser;
        this.context.user = updatedUser;
        const responseAlert = JSON.stringify(resData.data).slice(2,25);

        this.setState({ userAlert: responseAlert, user: updatedUser})
        this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
    };

  modalConfirmUpdateFieldHandler = (event) => {

      const token = this.context.token;
      const activityId = this.context.activityId;

      this.setState({ updatingField: false, userAlert: "Updating selected Staff by Field..." });

      let field = null;
      let query = event.target.formGridQuery.value;
      if (event.target.formGridFieldSelect.value === "select") {
        field = event.target.formGridField.value;
      } else {
        field = event.target.formGridFieldSelect.value;
      }

      const requestBody = {
        query:`
          mutation {updateUserField(activityId:"${activityId}",userId:"${activityId}",field:"${field}",query:"${query}")
          {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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

          const responseAlert = JSON.stringify(resData.data).slice(2,25);
          this.setState({ userAlert: responseAlert, user: resData.data.updateUserField})

          this.context.user = this.state.user;
          this.getThisUser();
        })
        .catch(err => {
          this.setState({userAlert: err});
        });
    }

  addUserTokensHandler = (event) => {
        const token = this.context.token;
        const activityId = this.context.activityId;

        this.setState({ adding: false, userAddField: null, userAlert: "Updating selected Staff by Field..." });

        const tokens = event.target.formGridTokens.value;

        const requestBody = {
          query:`
          mutation {addUserTokens(activityId:"${activityId}", userId:"${activityId}",userInput:{tokens:${tokens}})
          {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
              // this.setState({userAlert: 'Failed!'});
            }
            return res.json();
          })
          .then(resData => {

            const responseAlert = JSON.stringify(resData.data).slice(2,25);
            this.setState({userAlert: responseAlert, user: resData.data.addUserTokens})
            this.context.user = this.state.user;
            // this.getThisUser();
          })
          .catch(err => {
            this.setState({userAlert: err});
          });
      };

  addUserProfileImageHandler = (event) => {
      this.setState({ adding: false, userAddField: null, userAlert: "Updating selected Staff by Field..." });

      const token = this.context.token;
      const activityId = this.context.activityId;
      const profileImageName = event.target.formGridFilename.value;
      let profileImageType = null;
      if (
        event.target.formGridFiletype.value === "" ||
        event.target.formGridFiletype.value === null
      ) {
        profileImageType = "*";
      }
      const profileImagePath = event.target.formGridFilepath.value;
      if (this.state.user.profileImages.length  >= 9) {
        this.setState({userAlert: "Max no of profileImages 9 reached.."})
        return
      }

      const requestBody = {
        query:`
        mutation {addUserProfileImage(activityId:"${activityId}", userId:"${activityId}",userInput:{
          profileImageName:"${profileImageName}",
          profileImageType:"${profileImageType}",
          profileImagePath:"${profileImagePath}",
        })
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
            // this.setState({userAlert: 'Failed!'});
          }
          return res.json();
        })
        .then(resData => {
          const responseAlert = JSON.stringify(resData.data).slice(2,25);
          this.setState({ userAlert: responseAlert, user: resData.data.addUserProfileImage})
          this.context.user = this.state.user;
          // this.getThisUser();
        })
        .catch(err => {
          this.setState({userAlert: err});
        });
    };
  deleteUserProfileImage = (event) => {

    const token = this.context.token;
    const activityId = this.context.activityId;
    const profileImageName = event.name;
    const profileImageType = event.type;
    const profileImagePath = event.path;

    const requestBody = {
      query:`
        mutation {deleteUserProfileImage(activityId:"${activityId}",userId:"${activityId}",
        userInput:{
          profileImageName:"${profileImageName}",
          profileImageType:"${profileImageType}",
          profileImagePath:"${profileImagePath}",
        })
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
        console.log("resData",resData);
        const responseAlert = JSON.stringify(resData.data).slice(2,40);
        this.setState({ userAlert: responseAlert, user: resData.data.deleteUserProfileImage})
        // this.context.user = this.state.user;
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  addUserPerkHandler = (event) => {
    const token = this.context.token;
    const activityId = this.context.activityId;

    this.setState({ adding: false, userAddField: null, userAlert: "Updating selected Staff by Field..." });

    const perkDate = new Date();
    const perkName = event.target.formGridName.value;
    const perkDescription = event.target.formGridDescription.value;
    const perkImageLink = event.target.formGridImageLink.value;

    const requestBody = {
      query:`
      mutation {addUserPerk(activityId:"${activityId}", userId:"${activityId}",
      userInput: {
        perkDate:"${perkDate}",
        perkName:"${perkName}",
        perkDescription:"${perkDescription}",
        perkImageLink:"${perkImageLink}",
      })
      {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
          // this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(2,25);
        this.setState({ userAlert: responseAlert, user: resData.data.addUserPerk});
        this.context.user = this.state.user;
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  deleteUserPerk = (event) => {

    const token = this.context.token;
    const activityId = this.context.activityId;

    const perkDate = event.date;
    const perkName = event.name;
    const perkDescription = event.description;
    const perkImageLink = event.imageLink;
    console.log(perkDate,perkName,perkDescription);

    const requestBody = {
      query:`
        mutation {deleteUserPerk(activityId:"${activityId}",userId:"${activityId}",
        userInput:{
          perkDate:${perkDate},
          perkName:${perkName},
          perkDescription:${perkDescription},
          perkImageLink:${perkImageLink},
        })
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
          // this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {

        const responseAlert = JSON.stringify(resData.data).slice(2,25);
        this.setState({ userAlert: responseAlert, user: resData.data.deleteUserProfileImage})
        this.context.user = this.state.user;
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  addUserInterestsHandler = (event) => {
    const token = this.context.token;
    const activityId = this.context.activityId;

    this.setState({ adding: false, userAddField: null, userAlert: "Updating selected Staff by Field..." });

    const preInterests = event.target.formGridInterests.value;
    const requestBody = {
      query:`
        mutation {addUserInterests(activityId:"${activityId}",userId:"${activityId}",userInput:{interests:"${preInterests}"})
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
          // this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(2,25);
        this.setState({ userAlert: responseAlert, user: resData.data.addUserInterests});
        this.context.user = this.state.user;
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  deleteUserInterests = (event) => {

    const token = this.context.token;
    const activityId = this.context.activityId;

    const interests = event.interest;

    const requestBody = {
      query:`
        "mutation {deleteUserInterests(activityId:"${activityId}", userId:"${activityId}",
        userInput:{interest:"${interests}"})
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
          // this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(2,25);
        this.setState({ userAlert: responseAlert, user: resData.data.deleteUserInterests});
        this.context.user = this.state.user;
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  addUserTagsHandler = (event) => {
    const token = this.context.token;
    const activityId = this.context.activityId;

    this.setState({ adding: false, userAddField: null, userAlert: "Updating selected Staff by Field..." });

    const preTags = event.target.formGridTags.value;
    const requestBody = {
      query:`
        mutation {addUserTags(activityId:"${activityId}",userId:"${activityId}",userInput:{tags:"${preTags}"})
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
          // this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(2,25);
        this.setState({ userAlert: responseAlert, user: resData.data.addUserTags});
        this.context.userAlert = responseAlert;
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  };
  deleteUserTags = (event) => {

    const token = this.context.token;
    const activityId = this.context.activityId;
    const tags = event.tag;

    const requestBody = {
      query:`
        "mutation {deleteUserTags(activityId:"${activityId}", userId:"${activityId}",
        userInput:{tags:"${tags}"})
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
          // this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data).slice(2,25);
        this.setState({ userAlert: responseAlert, user: resData.data.deleteUserTags});
        this.context.user = this.state.user;
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  addUserBillingHandler = (event) => {

      this.setState({ adding: false, userAddField: null, userAlert: "Updating selected Staff by Field..." });

      const token = this.context.token;
      const activityId = this.context.activityId;
      const billingDate = new Date();
      const billingType = event.target.formGridTypeSelect.value;
      const billingDescription = event.target.formGridDescription.value;
      const billingAmount = event.target.formGridAmount.value;
      const billingPayment = event.target.formGridPayment.value;
      let billingPaid = false;
      if (event.target.formGridPaidCheckbox.checked === true) {
        billingPaid = true;
      }

      const requestBody = {
        query:`
        mutation {addUserBilling(activityId:"${activityId}", userId:"${activityId}",
        userInput:{
          billingDate:"${billingDate}",
          billingType:"${billingType}",
          billingDescription:"${billingDescription}",
          billingAmount:${billingAmount},
          billingPaid:${billingPaid},
          billingPayment:"${billingPayment}"
        })
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
            // this.setState({userAlert: 'Failed!'});
          }
          return res.json();
        })
        .then(resData => {
          const responseAlert = JSON.stringify(resData.data).slice(2,25);;
          this.setState({ userAlert: responseAlert, user: resData.data.addUserBilling});
          this.context.user = this.state.user;
          // this.getThisUser();
        })
        .catch(err => {
          this.setState({userAlert: err});
        });
    };
  deleteUserBilling = (event) => {
    const token = this.context.token;
    const activityId = this.context.activityId;
    const billingDate = new Date(event.date.slice(0,10)*1000).toISOString().slice(0,10)
    // const billingDate = event.date
    const billingType = event.type
    const billingDescription = event.description
    const billingAmount = event.amount
    const billingPaid = event.paid
    const billingPayment = event.payment

    const requestBody = {
      query:`
        "mutation {deleteUserBilling(activityId:"${activityId}", userId:"${activityId}",
        userInput:{
          billingDate: "${billingDate}",
          billingType: "${billingType}",
          billingDescription: "${billingDescription}",
          billingAmount: ${billingAmount},
          billingPaid: ${billingPaid},
          billingPayment: "${billingPayment}"
        })
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
        const responseAlert = JSON.stringify(resData.data).slice(2,25);
        this.setState({ userAlert: responseAlert, user: resData.data.deleteUserBilling});
        this.context.user = this.state.user;
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  addUserComplaintHandler = (event) => {

      this.setState({ adding: false, userAddField: null, userAlert: "Updating selected Staff by Field..." });

      const token = this.context.token;
      const activityId = this.context.activityId;
      const complaintDate = new Date();
      const complaintType = event.target.formGridTypeSelect.value;
      const complaintDescription = event.target.formGridDescription.value;
      const complainantId = "5e6312a84d494267fb64e60d";
      // const complainantId = this.context.model._id;
      const offenderId = this.context.selectedUser._id;

      if (complainantId === undefined ||
          complainantId.trim().length === 0) {
        this.setState({userAlert: "Please select a Model and try again"});
        return
      }
      if (offenderId === undefined ||
          offenderId.trim().length === 0) {
        this.setState({userAlert: "Please select a User and try again"});
        return
      }

      const requestBody = {
        query:`
        mutation {addUserComplaint(
          activityId:"${activityId}",
          userId:"${offenderId}",
          complainantId:"${complainantId}",
          userInput:{
            complaintDate:"${complaintDate}",
            complaintType:"${complaintType}",
            complaintDescription:"${complaintDescription}"
          })
        {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
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
            // this.setState({userAlert: 'Failed!'});
          }
          return res.json();
        })
        .then(resData => {
          const responseAlert = JSON.stringify(resData.data).slice(2,25);
          this.setState({ userAlert: responseAlert, user: resData.data.addUserComplaint});
          this.context.user = this.state.user;
          // this.getThisUser();
        })
        .catch(err => {
          this.setState({userAlert: err});
        });
    };
  deleteUserComplaint = (event) => {
    console.log(event);
    const token = this.context.token;
    const activityId = this.context.activityId;

    // const requestBody = {
    //   query:`
    //     "mutation {deleteUserComplaint(activityId:"${activityId}", userId:"${activityId}",
    //     userInput:{
    //       complaintDate: ${complaintDate},
    //       complaintType: ${complaintType},
    //       complaintDescription: ${complaintDescription},
    //       complaintComplainant: ${complaintComplainant}
    //     })
    //     {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description},models{_id,name,username,contact{email}},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,message,sender{role,ref},receiver{ref}},transactions{_id,date,time},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
    // //   `};
    //
    // fetch('http://localhost:9009/graphql', {
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
    // this.setState({userAlert: 'Failed!'});
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     const responseAlert = JSON.stringify(resData.data).slice(2,25);
    //     this.setState({ userAlert: responseAlert, user: resData.data.deleteUserComplaint})
    //     // this.getThisUser();
    //   })
    //   .catch(err => {
    //     this.setState({userAlert: err});
    //   });
  }
  deleteUserModel = (event) => {
    console.log(event);
    const token = this.context.token;
    const activityId = this.context.activityId;

    // const requestBody = {
    //   query:`
    //     "mutation {deleteUserComplaint(activityId:"${activityId}", userId:"${activityId}",
    //     userInput:{
    //       complaintDate: ${complaintDate},
    //       complaintType: ${complaintType},
    //       complaintDescription: ${complaintDescription},
    //       complaintComplainant: ${complaintComplainant}
    //     })
    //     {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description},models{_id,name,username,contact{email}},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,message,sender{role,ref},receiver{ref}},transactions{_id,date,time},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
    // //   `};
    //
    // fetch('http://localhost:9009/graphql', {
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
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     const responseAlert = JSON.stringify(resData.data).slice(2,25);
    //     this.setState({ userAlert: responseAlert, user: resData.data.deleteUserComplaint})
    //     this.context.user = this.state.user;
    //     // this.getThisUser();
    //   })
    //   .catch(err => {
    //     this.setState({userAlert: err});
    //   });
  }

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
          senderRole:"${role}",
          receiverRole:"${receiverRole}",
          senderId:"${activityId}",
          receiverId:"${receiverId}",
          messageInput: {
            date:"${date}",
            time:"${timeString2}",
            type:"${type}",
            subject:"${subject}",
            message:"${message}"
          })
        {_id,date,time,type,subject,sender{role,username,ref},receiver{role,username,ref},message,read}}
      `};

    this.sendSocketMessage(msgObject);
    
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
          // this.setState({userAlert: 'Failed!'});
        }
        return res.json();
      })
      .then(resData => {
        console.log("resData",resData);
        const responseAlert = JSON.stringify(resData.data).slice(2,25);;
        this.setState({ userAlert: responseAlert});
        // this.context.receiver = null;
        // this.callOut();
        // this.getThisUser();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  deleteUserMessage = (event) => {
    console.log(event);
    const token = this.context.token;
    const activityId = this.context.activityId;

    // const requestBody = {
    //   query:`
    //     "mutation {deleteUserComplaint(activityId:"${activityId}", userId:"${activityId}",
    //     userInput:{
    //       complaintDate: ${complaintDate},
    //       complaintType: ${complaintType},
    //       complaintDescription: ${complaintDescription},
    //       complaintComplainant: ${complaintComplainant}
    //     })
    //     {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description},models{_id,name,username,contact{email}},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,message,sender{role,ref},receiver{ref}},transactions{_id,date,time},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
    // //   `};
    //
    // fetch('http://localhost:9009/graphql', {
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
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     const responseAlert = JSON.stringify(resData.data).slice(2,25);
    //     this.setState({ userAlert: responseAlert, user: resData.data.deleteUserComplaint})
    //     this.context.user = this.state.user;
    //     // this.getThisUser();
    //   })
    //   .catch(err => {
    //     this.setState({userAlert: err});
    //   });
  }

  userCreateTransaction = (event) => {

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
    const description = event.target.formGridDescription.value;
    const amount = event.target.formGridAmount.value;

    const currentTokens = this.state.user.tokens;
    if (currentTokens - amount < 0) {
      this.setState({userAlert: "You don't have enough tokens for this transaction!!"});
      return
    } else {
      this.setState({userAlert: "You have enough tokens yaay"});
    }

    const transObject = {
      date: date,
      time: timeString2,
      type: type,
      amount: amount,
      senderName: senderName,
    };

    const requestBody = {
      query:`
        mutation {createTransaction(
          senderRole:"${role}",
          receiverRole:"${receiverRole}",
          senderId:"${activityId}",
          receiverId:"${receiverId}",
          transactionInput: {
            date:"${date}",
            time:"${timeString2}",
            type:"${type}",
            description:"${description}",
            amount:${amount}
          })
        {_id,date,time,type,sender{role,username,ref},receiver{role,username,ref},amount,description}}
      `};
      this.sendSocketTransaction(transObject);
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
      // .then(resData => {
      //   console.log("0",resData);
      //   const responseAlert = JSON.stringify(resData.data).slice(2,40);
      //   this.setState({ userAlert: responseAlert});
      //   this.context.receiver = null;
      //   // this.getThisUser();
      // })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  deleteUserTransaction = (event) => {
    console.log(event);
    const token = this.context.token;
    const activityId = this.context.activityId;

    // const requestBody = {
    //   query:`
    //     "mutation {deleteUserComplaint(activityId:"${activityId}", userId:"${activityId}",
    //     userInput:{
    //       complaintDate: ${complaintDate},
    //       complaintType: ${complaintType},
    //       complaintDescription: ${complaintDescription},
    //       complaintComplainant: ${complaintComplainant}
    //     })
    //     {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description},models{_id,name,username,contact{email}},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,message,sender{role,ref},receiver{ref}},transactions{_id,date,time},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
    // //   `};
    //
    // fetch('http://localhost:9009/graphql', {
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
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     const responseAlert = JSON.stringify(resData.data).slice(2,25);
    //     this.setState({ userAlert: responseAlert, user: resData.data.deleteUserComplaint})
    //     this.context.user = this.state.user;
    //     // this.getThisUser();
    //   })
    //   .catch(err => {
    //     this.setState({userAlert: err});
    //   });
  }

  getThisUser() {
    this.setState({ isLoading: true });
    const activityId = this.context.activityId;
    const requestBody = {
      query: `
      query {getThisUser(activityId:"${activityId}")
      {_id,name,dob,role,username,contact{email,phone},address{number,street,town,city,country,postalCode},bio,profileImages{name,type,path},interests,perks{date,name,description,imageLink},models{_id,name,username,contact{email},modelNames,profileImages{name,type},bio,interests},tokens,tags,loggedin,viewedShows{_id},viewedContent{_id},likedContent{_id},searches{date,query},comments{_id,date,time,content{_id}},messages{_id,date,time,type,subject,message,sender{role,username,ref},receiver{role,username,ref}},transactions{_id,date,time,type,amount,description,sender{role,username,ref},receiver{role,username,ref}},billing{date,type,description,amount,paid,payment},complaints{date,type,description,complainant{_id,name}}}}
        `};

    fetch('http://localhost:9009/graphql', {
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
          this.setState({ user: thisUser, isLoading: false });
          }
          if (sessionStorage.getItem('token')) {
            this.setState({userAlert: "Welcome Back..."})
          }
          if (thisUser.name === "Lord-of-the-Manor"){
            this.setState({canDelete: true, userAlert: "Mi'Lord!!"})
          }
          // this.listenToBase();
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

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

  addUserField = (args) => {
    this.setState({adding: true, userAddField: args})
  }
  addUserProfileImage = () => {
    this.setState({adding: true, userAddField: "profileImage"})
  }
  addUserPerk = () => {
    this.setState({adding: true, userAddField: "perk"})
  }
  addUserInterests = () => {
    this.setState({adding: true, userAddField: "interests"})
  }
  addUserTags = () => {
    this.setState({adding: true, userAddField: "tags"})
  }
  addUserTokens = () => {
    this.setState({adding: true, userAddField: "tokens"})
  }
  addUserComplaint = () => {
    this.setState({adding: true, userAddField: "complaint"})
  }
  addUserBilling = () => {
    this.setState({adding: true, userAddField: "billing"})
  }
  startCreateMessage = () => {
    if (this.context.receiver === null) {
      this.setState({userAlert: "select a receiver 1st..."});
    }
    this.setState({adding: true, userAddField: "message"})
  }
  startCreateTransaction = () => {
    if (this.context.receiver === null) {
      this.setState({userAlert: "select a receiver 1st..."});
    }
    this.setState({adding: true, userAddField: "transaction"})
  }

  sendSocketMessage (msgObject) {
    const message = msgObject;
    console.log("sending socket message  ",message);
    // console.log("sending socket message  ",JSON.stringify(message));

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

  sendSocketTransaction (transObject) {
    const transaction = transObject;
    console.log("sending socket message  ",transaction);
    // console.log("sending socket message  ",JSON.stringify(message));

    let conversationId = null;
    if (this.context.receiver === null || this.context.receiver === undefined) {
      console.log("select someone to send to 1st...");
      this.setState({userAlert: "select someone to send to 1st..."});
      return
    }
    else {
      conversationId = this.context.receiver._id;
    }

    this.socket.emit('send transaction', {
      room: 'trans'+conversationId,
      transaction: transaction
    });
    this.socket.on("TRANSACTION_SENT", function(data) {
      addTransaction(data)
    })
    const addTransaction = data => {
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

                  canDelete={this.state.canDelete}

                  onEdit={this.modalConfirmUpdateHandler}
                  onEditField={this.modalConfirmUpdateFieldHandler}

                  addProfileImage={this.addUserProfileImageHandler}
                  addPerk={this.addUserPerkHandler}
                  addInterests={this.addUserInterestsHandler}
                  addTags={this.addUserTagsHandler}
                  addTokens={this.addUserTokensHandler}
                  addComplaint={this.addUserComplaintHandler}
                  addBilling={this.addUserBillingHandler}

                  createMessage={this.userCreateMessage}
                  createTransaction={this.userCreateTransaction}

                  onProfileImageDelete={this.deleteUserProfileImage}
                  onPerkDelete={this.deleteUserPerk}
                  onTagsDelete={this.deleteUserTags}
                  onInterestDelete={this.deleteUserInterests}
                  onComplaintDelete={this.deleteUserComplaint}
                  onBillingDelete={this.deleteUserBilling}
                  onMessageDelete={this.deleteUserMessage}
                  onTransactionDelete={this.deleteUserTransaction}
                  onUserModelDelete={this.deleteUserModel}

                  onCancel={this.modalCancelHandler}

                  onStartUpdate={this.startUpdateUserHandler}
                  onStartUpdateField={this.startUpdateUserFieldHandler}
                  onStartAddProfileImage={this.addUserProfileImage}
                  onStartAddPerk={this.addUserPerk}
                  onStartAddInterests={this.addUserInterests}
                  onStartAddTags={this.addUserTags}
                  onStartAddTokens={this.addUserTokens}
                  onStartAddComplaint={this.addUserComplaint}
                  onStartAddBilling={this.addUserBilling}
                  onStartCreateMessage={this.startCreateMessage}
                  onStartCreateTransaction={this.startCreateTransaction}

                  onStartLoadMessage={this.loadUserMessages}
                  userMessagesLoaded={this.state.messagesLoaded}
                  userMessages={this.state.userMessages}
                  updating={this.state.updating}
                  updatingField={this.state.updatingField}
                  userAddField={this.state.userAddField}

                  selectedUser={this.context.selectedUser}
                  selectedModel={this.context.selectedModel}
                  messageReceiver={this.context.receiver}

                  onCallOut={this.callOut}
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
