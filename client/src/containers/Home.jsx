import React, { Component } from "react";
import { connect } from "react-redux";

import { logoutUser } from "../actions/user_actions";
import "../css/index.css";


class Home extends Component {

    onLogoutClick = () => {
        this.props.history.push("/login");
        this.props.logoutUser();
    }

    render() {
        return (
            <div className="login-container">
                <main>
                    <h1>You are logged in now. On refresh of the page, you will be logged out.</h1>
                    <button onClick={this.onLogoutClick}>Logout</button>
                </main>  
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loggedIn: state.user.loggedIn
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logoutUser: () => { return logoutUser(dispatch) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);