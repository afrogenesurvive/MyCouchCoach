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
            <h1>Jam Cams 0.0.3</h1>

          </div>
          <nav className="main-navigation__items">

            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Login</NavLink>
                </li>
              )}
              {!context.token && (
                <li>
                  <NavLink to="/signup">Signup</NavLink>
                </li>
              )}
              {context.token && (
                <React.Fragment>
                  {props.role === "User" && (
                    <li>
                      <NavLink to="/userProfile">My Profile (User)</NavLink>
                    </li>
                  )}
                  {props.role === "Model" && (
                    <li>
                      <NavLink to="/modelProfile">My Profile (Model)</NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink to="/users">Users</NavLink>
                  </li>
                  <li>
                    <NavLink to="/models">Models</NavLink>
                  </li>
                  <li>
                    <NavLink to="/content">Content</NavLink>
                  </li>
                  <li>
                    <NavLink to="/shows">Shows</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
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
