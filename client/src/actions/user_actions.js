import axios from "axios";
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "../types/user_types";


export function userOTPLogin(dispatch, loginInfo) {
    return new Promise((resolve, reject) => {
        axios.post("/user/verifyOtp", loginInfo).then((resp) => {
            dispatch({
                type: LOGIN_SUCCESS
            })
            resolve(resp);
        }).catch((err) => {
            reject(err);
        })
    })
}

export function userEmailLogin(dispatch, loginInfo) {
    return new Promise((resolve, reject) => {
        axios.post("/login", loginInfo).then((resp) => {
            dispatch({
                type: LOGIN_SUCCESS
            })
            resolve(resp);
        }).catch((err) => {
            reject(err);
        })
    })
}

export function logoutUser(dispatch) {
    return new Promise((resolve, reject) => {
        axios.get("/logout").then((resp) => {
            resolve(resp);
        }).catch((err) => {
            reject(err);
        })
    })
}

export function fetchUserInfo(dispatch) {
    return new Promise((resolve, reject) => {
        axios.get("/profile").then((resp) => {
            resolve(resp);
        }).catch((err) => {
            reject(err);
        })
    })
}

export function loginwithGoogle(dispatch) {
    return new Promise((resolve, reject) => {
        axios.get("auth/login").then((resp) => {
            dispatch({
                type: LOGIN_SUCCESS
            })
            resolve(resp);
        }).catch((err) => {
            reject(err);
        })
    })
}


export function getGoogleAccountsUrl(dispatch) {
    return new Promise((resolve, reject) => {
        axios.get("/getGoogleUrl").then((resp) => {
            resolve(resp);
        }).catch((err) => {
            reject(err);
        })
    })
}