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
        axios.post("/user/login", loginInfo).then((resp) => {
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
    dispatch({
        type: LOGOUT_SUCCESS
    })
}