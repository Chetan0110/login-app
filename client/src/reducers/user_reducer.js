import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS } from "../types/user_types";


export default function(initialState = { loggedIn: false }, action) {
    switch(action.type) {
        case LOGIN_SUCCESS: 
            return { ...initialState, loggedIn: true };
        case LOGIN_FAILURE:
            return { ...initialState, loggedIn: false };
        case LOGOUT_SUCCESS: 
            return { ...initialState, loggedIn: false };
        default:
            return initialState;
    }
}