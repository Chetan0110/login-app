import React, { Component } from "react";
import { connect } from "react-redux";

import { logoutUser, fetchUserInfo } from "../actions/user_actions";
import "../css/index.css";


class Home extends Component {
    constructor(props) {
        super(props);
        this.state  = {
            firstName: "",
            email: ""
        }
    }
    componentDidMount() {
        this.props.fetchUserInfo().then((resp) => {
            this.setState({ firstName: resp.data.local.firstName, email: resp.data.local.email });
        }).catch((err) => {
            this.props.history.push("/");
        });
    }

    logoutUser = () => {
        this.props.logoutUser().then((resp) => {
            if (resp.status === 200) {
                this.props.history.push("/login");
            }
        }).catch((err) => {
            console.error("Error while logging you out...", err);
        });
    }

    render() {
        return (
            <div className="login-container">
                <main>
                    <h1>{this.state.firstName + ", " + "you are logged in with email " + this.state.email}</h1>
                    <button onClick={this.logoutUser}>Logout</button>
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
        fetchUserInfo: () => { return fetchUserInfo(dispatch) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);