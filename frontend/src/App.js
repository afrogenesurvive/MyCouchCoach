import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/auth/Auth';
import SignupPage from './pages/auth/Signup';

import UserProfile from './pages/user/UserProfile';
import ModelProfile from './pages/model/ModelProfile';
import UsersPage from './pages/user/Users';
import ModelsPage from './pages/model/Models';
import ContentPage from './pages/content/Content';

// import ShowsPage from './pages/show/Shows';
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
      role: null,
      userId: null,
      modelId: null,
      contentId: null,
      showId: null,
      user: {},
      users:[],
      selectedUser: {},
      model: {},
      models:[],
      selectedModel: {},
      content: {},
      contents:[],
      selectedContent: {},
      show: {},
      shows:[],
      selectedShow: {},
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

    // const socket = io('http://localhost:9007');
    //   socket.on('news1', function (data) {
    //     console.log("it's aliiiive!!",data);
    //     // socket.emit('my other event', { my: 'data' });
    //   });
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              activityId: this.state.activityId,
              role: this.state.role,
              userId: null,
              modelId: null,
              contentId: null,
              showId: null,
              user: {},
              users:[],
              selectedUser: {},
              model: {},
              models:[],
              selectedModel: {},
              content: {},
              contents:[],
              selectedContent: {},
              show: {},
              shows:[],
              selectedShow: {},
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

                { // logged in -> pages
                this.state.token &&
                this.state.role === "User" && <Redirect from="/" to="/userProfile" exact />}
                {this.state.token &&
                  this.state.role === "Model" && <Redirect from="/" to="/modelProfile" exact />}

                {this.state.token &&
                  this.state.role === "User" && (<Route path="/userProfile" component={UserProfile} />)}
                {this.state.token &&
                  this.state.role === "Model" && (<Route path="/modelProfile" component={ModelProfile} />)}

                {this.state.token &&
                  this.state.role === "User" && (
                    <Redirect from="/auth" to="/userProfile" exact />
                )}
                {this.state.token && this.state.role === "Model" && (
                    <Redirect from="/auth" to="/modelProfile" exact />
                )}

                {this.state.token && (<Route path="/users" component={UsersPage} />)}
                {this.state.token && (<Route path="/models" component={ModelsPage} />)}
                {this.state.token && (<Route path="/content" component={ContentPage} />)}
                {
                  // this.state.token && (<Route path="/shows" component={ShowsPage} />)
                }

                { //if not logged in -> go to login page
                !this.state.token && (<Route path="/auth" component={AuthPage} />)}
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
