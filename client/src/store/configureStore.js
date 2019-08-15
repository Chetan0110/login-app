/**
 * configureStore
 * Description: This file is used to configure the store for our apllication, by applying all middlewares.
 * Return: The store object.
 */

import thunk from "redux-thunk"
import { createLogger } from "redux-logger"
import { applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"

import rootReducer from "../reducers"


// Be sure to ONLY add this middleware in development!
const middleware = process.env.REACT_APP_ENVIRONMENT !== "prod" ?
    [require("redux-immutable-state-invariant").default(), thunk, createLogger()] :
    [thunk]

export default function configureStore() {
    return createStore(rootReducer, composeWithDevTools(
        applyMiddleware(...middleware)
    ))
}
