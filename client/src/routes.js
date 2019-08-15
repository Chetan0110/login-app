import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from "./containers/Login";
import "./css/routes.css";
import Signup from "./components/Signup";
import AccessControlComponent from "./containers/AccessControlComponent";
import Home from "./containers/Home";

export default function routes() {
  return (
    <Router>
      <div className="routeDiv">
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/home" render={props => (<AccessControlComponent onSuccess={Home} onFailure={Login} {...props}/>)}/>
      </div>
    </Router>
  );
}
