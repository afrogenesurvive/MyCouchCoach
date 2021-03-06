import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/auth/Auth';
import SignupPage from './pages/auth/Signup';

import UserProfile from './pages/user/UserProfile';
import UsersPage from './pages/user/Users';
import LessonsPage from './pages/lesson/Lessons';
import PublicLessonsPage from './pages/lesson/PublicLessons';
import ProfileLessonViewer from './components/ProfileLessonViewer';
// import ErrorPage from './components/ErrorPage';
import PasswordReset from './pages/auth/PasswordReset';
import LandingPage from './pages/Landing';

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
    passwordResetState: 'incomplete',
    passwordResetMessage: '...'
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.sessionStorageAuth = null;
    this.socket = io('http://localhost:9099');
  }

  login = (token, activityId, role, tokenExpiration) => {
    this.setState({
      token: token,
      activityId: activityId,
      role: role
    });
    this.context.token = token;
    this.context.activityId = activityId;
    this.context.role = role;
    // this.socket.emit('msg_subscribe', {user: activityId, room:'msg'+activityId});
  };

  logout = () => {
      this.logout2();
  };


  componentDidMount() {
    // console.log(this.socket.connected);
    console.log('...app component mounted...');

    if (sessionStorage.getItem('login info') && this.state.token === null) {

      let seshStore = sessionStorage.getItem('login info');
      this.context.token = seshStore.token;
      this.context.activityId = seshStore.activityId;
      this.context.role = seshStore.role;
      this.setState({
        sessionCookiePresent: true,
        activityId: seshStore.activityId,
        token: seshStore.token,
        });
    };

    // const conversationId = this.context.activityId;
    this.socket.emit('unauthorizedClientConnect');
    console.log("socket listening....");
  }

  componentWillUnmount() {
    console.log('...app component un-mounting...');
  }

  logout2 () {
    console.log('...logging you out...');
    const token = this.context.token;
    const activityId = this.context.activityId;
    const requestBody = {
      query:`
        query{logout(
          activityId:"${activityId}")
        {_id,loggedIn}}
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
        };

      })
      .catch(err => {
        console.log(err);
        // this.setState({userAlert: err});
      });
  }

  userOffline () {
    console.log('...taking user offline...');
    const token = this.context.token;
    const activityId = this.context.activityId;
    const requestBody = {
      query:`
      mutation{userOffline(
        activityId:"${activityId}",
        userId:"${activityId}")
      {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path,public},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path,public},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},toTeachLessons{_id,title,category,price},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,sessionTitle,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}},cancellations{date,reason,sessionDate,sessionTitle,lesson{_id,title}},notifications{_id,createDate,sendDate,creator{_id,username,contact{email,phone}},type,title,time,trigger{unit,value},lesson{_id,title},session{title,date,endDate,time},recipients{_id,username,contact{email,phone}},body,delivery{type,params,sent}}}}
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
        // const responseAlert = JSON.stringify(resData.data.userOffline).slice(2,25);
        // this.context.user = ;
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  passwordReset = (event) => {
    event.preventDefault();
    console.log('...reset password submission...');
      const params = event.target.formGridParams.value.split('@');
      const verificationCode = params[1];
      const userId = params[0];
      const password = event.target.formGridPassword.value;
      // console.log('params',params);

      const requestBody = {
        query:`
          mutation {resetUserPassword(
            userId:"${userId}",
            verification:"${verificationCode}",
            userInput:{
              password:"${password}"
            })
            {_id,password,verification{verified}}}
        `};

      fetch('http://localhost:8088/graphql', {
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
          console.log('passwordReset',resData);
          if (resData.errors) {
            this.setState({passwordResetState: 'error', passwordResetMessage: resData.errors[0].message+'..if not, try making a new reset request..' })
          } else {
            this.setState({passwordResetState: 'complete' })
          }

        })
        .catch(err => {
          console.log(err);
          this.setState({passwordResetState: 'error', passwordResetMessage: err })
        });
        // this.setState({passwordResetState: 'complete' })
  }
  cancelPasswordReset = () => {
    this.setState({passwordResetState: 'cancelled'})
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
                <Route path="/home" component={LandingPage} />
                  {
                    // this.state.token && (<Redirect from="/" to="/userProfile" exact />)
                  }

                  {
                    // !this.state.token && (<Route path="/passwordReset/:user" component={PasswordReset} />)
                  }
                  {!this.state.token && (<Route path="/passwordReset/:params" render={(props) => <PasswordReset {...props}
                    passwordReset={this.passwordReset}
                    cancelPasswordReset={this.cancelPasswordReset}
                    resetState={this.state.passwordResetState}
                    message={this.state.passwordResetMessage}
                    />}
                  />)}
                  {

                  }
                  {this.state.token && (<Route path="/userProfile" component={UserProfile} />)}
                  {this.state.token && (<Route path="/userProfile/LessonDetailViewer" component={ProfileLessonViewer} />)}

                  {this.state.token && (<Redirect from="/login" to="/userProfile" exact />)}

                  {this.state.token && (<Route path="/users" component={UsersPage} />)}
                  {this.state.token && (<Route path="/lessons" component={LessonsPage} />)}

                  {!this.state.token && (<Route path="/lessons/public" component={PublicLessonsPage} />)}
                  {!this.state.token && (<Route path="/login" component={AuthPage} />)}
                  {!this.state.token && (<Route path="/signup" component={SignupPage} />)}
                  {
                    !this.state.token && !sessionStorage.getItem('token') && (<Redirect from="*" to="/home" exact />)
                  }
                  {
                    // !this.state.token && (<Redirect to="/login" exact />)
                    !this.state.token && sessionStorage.getItem('token') && (<Redirect to="/login" exact />)
                  }
                  {
                    // !this.state.token && (<Route path="*" component={ErrorPage}/>)
                  }
              </Switch>
            </main>

          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
