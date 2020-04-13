import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/auth/Auth';
import SignupPage from './pages/auth/Signup';

import UserProfile from './pages/user/UserProfile';
import UsersPage from './pages/user/Users';
import LessonsPage from './pages/lesson/Lessons';

import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';
import io from 'socket.io-client';

import './App.css';

class App extends Component {
  state = {
    token: null,
    activityId: null,
    role: null,
    context: this.context,
    sessionCookiePresent: false,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.sessionStorageAuth = null;
    this.socket = io('http://localhost:7770');
  }

  login = (token, activityId, role, tokenExpiration) => {
    this.setState({
      token: token,
      activityId: activityId,
      role: role
    });

    this.socket.emit('msg_subscribe', {user: activityId, room:'msg'+activityId});
  };

  logout = () => {
    this.setState({
       token: null,
       activityId: null,
       role: null,
       sessionCookiePresent: null
      });
    sessionStorage.clear();
    this.context = {
      token: null,
      activityId: null,
      activityA: null,
      activityB: null,
      activityC: null,
      role: null,
      userId: null,
      user: {},
      users:[],
      selectedUser: null,
      lesson: {},
      lessons: [],
      selectedLesson: null,
      selectedPerk: null,
      selectedPromo: null,
      selectedReview: null,
      sender: null,
      receiver: null,
      userAlert: "...",
      file: null,
      fancyDate: null,
      login: this.login,
      logout: this.logout,
    }
  };


  componentDidMount() {
    console.log(this.socket.connected);

    if (sessionStorage.getItem('login info')) {

      let seshStore = sessionStorage.getItem('login info');
      this.context.token = seshStore.token;
      this.context.activityId = seshStore.activityId;
      this.context.role = seshStore.role;
      this.setState({
        sessionCookiePresent: true,
        token: seshStore.token,
        });
    };

    const conversationId = this.context.activityId;
    this.socket.emit('unauthorizedClientConnect');
    console.log("socket listening....");
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

    // this.userOnline();
  }

  componentWillUnmount() {
    // this.UserOffline();
  }

  userOnline () {
    const token = this.context.token;
    const activityId = this.context.activityId;
    const requestBody = {
      query:`
        mutation{userOnline(
          activityId:"${activityId}",
          userId:"${activityId}")
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    ec2-3-81-110-166.compute-1.amazonaws.com/graphql
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
        const responseAlert = JSON.stringify(resData.data.userOnline).slice(2,25);
        // this.context.user = ;
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  userOffline () {
    const token = this.context.token;
    const activityId = this.context.activityId;
    const requestBody = {
      query:`
      mutation{userOffline(
        activityId:"${activityId}",
        userId:"${activityId}")
      {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle},interests,perks{_id},promos{_id},friends{_id,username},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id},bookedLessons{date,ref{_id,title}},attendedLessons{date,ref{_id,title}},taughtLessons{date,ref{_id,title}},wishlist{date,ref{_id,title},booked},cart{dateAdded,sessionDate,lesson{_id,title}},comments{_id},messages{_id},orders{_id},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    ec2-3-81-110-166.compute-1.amazonaws.com/graphql
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

        const responseAlert = JSON.stringify(resData.data.userOffline).slice(2,25);
        // this.context.user = ;
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              activityId: this.state.activityId,
              activityA: null,
              activityB: null,
              activityC: null,
              role: this.state.role,
              userId: null,
              user: {},
              users:[],
              selectedUser: {},
              lesson: {},
              lessons: [],
              selectedLesson: {},
              selectedPerk: {},
              selectedPromo: {},
              selectedReview: {},
              sender: null,
              receiver: null,
              userAlert: "...",
              file: null,
              fancyDate: null,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation
              role={this.state.role}
            />
            <main className="main-content">
              <Switch>

                {this.state.token && <Redirect from="/" to="/userProfile" exact />}

                {this.state.token && (<Route path="/userProfile" component={UserProfile} />)}

                {this.state.token && (<Redirect from="/auth" to="/userProfile" exact />)}

                {
                  this.state.token && (<Route path="/users" component={UsersPage} />)
                }
                {
                  this.state.token && (<Route path="/lessons" component={LessonsPage} />)
                }

                {!this.state.token && (<Route path="/auth" component={AuthPage} />)}
                {!this.state.token && (<Route path="/signup" component={SignupPage} />)}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>

          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
