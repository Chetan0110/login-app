import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import { userOTPLogin, userEmailLogin, getGoogleAccountsUrl } from "../actions/user_actions";
import "../css/index.css";


export class Login extends Component {

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
            otpSent: false,
            googleAccountsUrl: ""
        }
    }

    componentDidMount() {
        this.props.getGoogleAccountsUrl().then((resp) => {
            this.setState({ googleAccountsUrl: resp.data.googleAccountsUrl });
        });
    }

    onLoginClick = () => {
        if (this.state.credentials.otp.length > 0) {
            this.props.userOTPLogin({...this.state.credentials}).then((resp) => {
                this.setState({
                    credentials: {
                        phoneNumber: "",
                        email: "",
                        password: "",
                        otp: ""
                    },
                    message: resp.data.message,
                    hasError: false,
                    showOTPButton: false,
                    otpSent: false
                })
                this.props.history.push(`/home`);
            }).catch((err) => {
                this.setState({
                    message: err.response.data.message,
                    hasError: true,
                    otp: ""
                })
            })
        } else if (this.state.otpSent && this.state.credentials.otp.length === 0) {
            this.setState({
                message: "Enter OTP",
                hasError: true
            })
        } else {
            this.props.userEmailLogin({...this.state.credentials}).then((resp) => {
                this.setState({
                    credentials: {
                        phoneNumber: "",
                        email: "",
                        password: "",
                        otp: ""
                    },
                    message: "",
                    hasError: false,
                    showOTPButton: false,
                    otpSent: false
                })
                this.props.history.push(`/home`);
            }).catch((err) => {
                this.setState({
                    message: "",
                    hasError: true,
                    password: "",
                    otp: ""
                })
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
                    <input type="email" name="email" placeholder="Enter Email" style={{ width: "95%" }} 
                        onChange={(e) => this.onChange(e, "email")}
                        value={ this.state.credentials.phoneNumber || this.state.credentials.email}
                    />
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
                    <div className="or-option">
                        <hr />
                        <span>OR</span>
                        <hr />
                    </div>
                    <a href={this.state.googleAccountsUrl} className="google-login">
                        <button className="login-button-google">Log In with Google</button>
                    </a>
                    <div className="unregistered">Haven't registered yet? <a href="/signup">Register here.</a></div>
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
        userOTPLogin: (loginInfo) => { return userOTPLogin(dispatch, loginInfo) },
        userEmailLogin: (loginInfo) => { return userEmailLogin(dispatch, loginInfo) },
        getGoogleAccountsUrl: () => { return getGoogleAccountsUrl(dispatch) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);