import React, { Component } from "react";

import "../css/index.css";
import axios from "axios";


export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            credentials: {
                email: "",
                password: ""
            },
            message: "",
            hasError: false
        }
    }

    onLoginClick = (event, fieldName) => {
        axios.post("/user/login", {...this.state.credentials}).then((resp) => {
            this.setState({
                credentials: {
                    email: "",
                    password: ""
                },
                message: resp.data.message,
                hasError: false
            })
            // this.props.history.push(`/login`);
        }).catch((err) => {
            this.setState({
                message: err.response.data.message,
                hasError: true
            })
            console.error(err);
        })
    }

    onChange = (event, fieldName) => {
        let credentials = {...this.state.credentials};
        credentials[fieldName] = event.target.value;
        this.setState({ credentials });
    }

    render() {
        return (
            <div className="login-container">
                <main>
                <h1 className="page-title">Login</h1>
                    <div className="css-hc6lm9">
                        <input type="email" name="email" placeholder="Enter Email" style={{ width: "98%" }} 
                            onChange={(e) => this.onChange(e, "email")}
                            value={this.state.credentials.email}
                        />
                    </div>
                    <input type="password" name="password" placeholder="Enter Password" 
                        onChange={(e) => this.onChange(e, "password")} 
                        value={this.state.credentials.password}
                    />
                    <button onClick={this.onLoginClick}>Login</button>
                    {
                        this.state.message.length > 0 &&
                        <div className={this.state.hasError ? "login-failure" : "login-success"}>{this.state.message}</div>
                    }
                    <a href="" className="forgot-password-link">Forgot Password</a>
                    <div className="or-option">
                        <hr/>
                            <span>OR</span>
                        <hr/>
                    </div>
                    <a href="" className="google-login">
                        <button className="login-button-google">Login with Google</button>
                    </a>
                    <div className="forgot-password-link">Haven't registered yet? <a href="/signup">Register here.</a></div>
                </main>
            </div>
        )
    }
}