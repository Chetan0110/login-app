import React, { Component } from "react";
import axios from "axios";

import "../css/index.css";


export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            credentials: {
                email: "",
                password: "",
                phoneNumber: "",
                otp: ""
            },
            message: "",
            hasError: false,
            showOTPButton: false,
            otpSent: false
        }
    }

    onLoginClick = () => {
        if (this.state.credentials.otp.length > 0) {
            axios.post("/user/verifyOtp", {...this.state.credentials}).then((resp) => {
                this.setState({
                    credentials: {
                        phoneNumber: "",
                        email: "",
                        password: "",
                        otp: ""
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
        } else {
            axios.post("/user/login", {...this.state.credentials}).then((resp) => {
                this.setState({
                    credentials: {
                        phoneNumber: "",
                        email: "",
                        password: "",
                        otp: ""
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
    }

    onGetOTPClick = () => {
        axios.post("/user/sendOtp", {...this.state.credentials}).then((resp) => {
            this.setState({
                message: resp.data.message,
                hasError: false,
                otpSent: true,
                showOTPButton: false
            })
            // this.props.history.push(`/login`);
        }).catch((err) => {
            this.setState({
                message: err.response.data.message,
                hasError: true,
            })
            console.error(err);
        })
    }

    onChange = (event, fieldName) => {
        let credentials = {...this.state.credentials};
        credentials[fieldName] = event.target.value;
        if (fieldName === "email") {
            credentials["phoneNumber"] = event.target.value;
        }
        if (fieldName === "email" && !this.validateEmail(event.target.value) && this.validatePhoneNumber(event.target.value)) {
            this.setState({ showOTPButton: true });
        }
        this.setState({ credentials });
    }

    validatePhoneNumber = (phoneNumber) => {
        var phoneno = /^\d{10}$/;
        if(phoneNumber.match(phoneno)) {
            return true;
        }
        else {
            // alert("Not a valid Phone Number");
            return false;
        }
    }

    validateEmail = (mail) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        // alert("You have entered an invalid email address!")
        return (false)
    }

    render() {
        return (
            <div className="login-container">
                <main>
                <h1 className="page-title">Login</h1>
                    <div className="css-hc6lm9">
                        <input type="email" name="email" placeholder="Enter Email" style={{ width: "98%" }} 
                            onChange={(e) => this.onChange(e, "email")}
                            value={ this.state.credentials.phoneNumber || this.state.credentials.email}
                        />
                    </div>
                    {
                        !this.state.showOTPButton && !this.state.otpSent &&
                            <input type="password" name="password" placeholder="Enter Password" 
                                onChange={(e) => this.onChange(e, "password")} 
                                value={this.state.credentials.password}
                            />
                    }
                    {
                        this.state.otpSent && 
                            <input type="number" name="otp" placeholder="Enter OTP" 
                                onChange={(e) => this.onChange(e, "otp")} 
                                value={this.state.credentials.otp}
                            />
                    }
                    {
                        !this.state.showOTPButton &&
                            <button onClick={this.onLoginClick}>Login</button>   
                    }
                    {
                        this.state.showOTPButton && 
                            <button onClick={this.onGetOTPClick}>Get OTP</button>
                    }
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