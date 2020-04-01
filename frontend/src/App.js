import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/auth/Auth';
import SignupPage from './pages/auth/Signup';

import UserProfile from './pages/user/UserProfile';
import UsersPage from './pages/user/Users';

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
  }

  login = (token, activityId, role, tokenExpiration) => {
    this.setState({
      token: token,
      activityId: activityId,
      role: role
    });
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

  constructor(props){
      super(props);
      this.socket = io('http://localhost:7770');
    }


  componentDidMount() {

    if (sessionStorage.getItem('login info')) {

      let seshStore = sessionStorage.getItem('login info');
      this.context.token = seshStore.token;
      this.context.activityId = seshStore.activityId;
      this.context.role = seshStore.role;
      this.setState({
        sessionCookiePresent: true,
        token: seshStore.token,
        });
    }
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

    // call func to set online status here and on componentWillUnmount
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

                {this.state.token && (<Route path="/users" component={UsersPage} />)}

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
