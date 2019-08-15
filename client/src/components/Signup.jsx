import React, { Component } from "react";

import "../css/index.css";
import axios from "axios";


export default class Signup extends Component {

    constructor() {
        super();
        this.state = {
            userInfo: {
                firstName: "",
                lastName: "",
                phoneNumber: "",
                email: "",
                password: ""
            },
            message: "",
            hasError: false
        }
    }

    onSignUpClick = () => {
        axios.post("/user/signup", {...this.state.userInfo}).then((resp) => {
            this.setState({
                userInfo: {
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
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
        let userInfo = {...this.state.userInfo};
        userInfo[fieldName] = event.target.value;
        this.setState({ userInfo });
    }

    render() {
        return (
            <div className="login-container">
                <main>
                    <h1 className="page-title">Sign Up</h1>
                    <input type="text" name="firstname" placeholder="Enter First Name" 
                        onChange={(e) => this.onChange(e, "firstName")} 
                        value={this.state.userInfo.firstName}
                    />
                     <input type="text" name="lastname" placeholder="Enter Last Name" 
                        onChange={(e) => this.onChange(e, "lastName")} 
                        value={this.state.userInfo.lastName}
                    />
                     <input type="number" name="phonenumber" placeholder="Enter Phone Number" 
                        onChange={(e) => this.onChange(e, "phoneNumber")} 
                        value={this.state.userInfo.phoneNumber}
                    />
                    <input type="email" name="email" placeholder="Enter Email" 
                        onChange={(e) => this.onChange(e, "email")}
                        value={this.state.userInfo.email}
                    />
                    <input type="password" name="password" placeholder="Enter Password" 
                        onChange={(e) => this.onChange(e, "password")} 
                        value={this.state.userInfo.password}
                    />
                    <button onClick={this.onSignUpClick}>Sign Up</button>
                    {
                        this.state.message.length > 0 &&
                        <div className={this.state.hasError ? "register-failure" : "register-success"}>{this.state.message}</div>
                    }
                    <div className="registered">Already registered once? <a href="/login">Login here.</a></div>
                </main>
            </div>
        )
    }
}