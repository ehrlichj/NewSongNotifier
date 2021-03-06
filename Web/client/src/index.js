import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from "./signup.js";
import Login from "./login.js";
import Home from "./home.js";
import Profile from "./Profile.js";
import error from "./error.js";
import confirm from "./confirm.js";
import confirm2 from "./confirm2.js";

import * as serviceWorker from './serviceWorker';
import {BrowserRouter,Route} from "react-router-dom";


ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/" component={Home}/>
    <Route exact path="/signup" component={SignUp}/>
    <Route exact path="/login" component={Login}/>
    <Route exact path="/profile" component={Profile}/>
    <Route exact path="/error" component={error}/>
    <Route exact path="/confirm" component={confirm}/>
    <Route exact path="/confirm2" component={confirm2}/>
  </BrowserRouter>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
