import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from "./components/Login";
import "./css/routes.css";
import Signup from "./components/Signup";

export default function routes() {
  return (
    <Router>
      <div className="routeDiv">
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </div>
    </Router>
  );
}
