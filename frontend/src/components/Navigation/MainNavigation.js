import React from 'react';
import { NavLink } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';


const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>My Couch Coach 0.1.3</h1>

          </div>
          <nav className="main-navigation__items">

            <ul>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
              {!context.token && (
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
              )}
              {!context.token && (
                <li>
                  <NavLink to="/signup">Signup</NavLink>
                </li>
              )}
              {context.token && (
                <React.Fragment>

                  <li>
                    <NavLink to="/userProfile">My Profile</NavLink>
                  </li>
                  <li>
                    <NavLink to="/users">Users</NavLink>
                  </li>
                  <li>
                    <NavLink to="/lessons">Lessons</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
              {!context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/lessons/public">Lessons</NavLink>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
