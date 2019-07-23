/* eslint no-underscore-dangle: ["error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] }] */
import { combineReducers, applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";

import accountReducer from "scripts/modules/Accounts/reducer";
import appReducer from "scripts/modules/App/reducer";
import getStartedReducer from "scripts/modules/Get-Started/reducer";
import loginReducer from "scripts/modules/Login/reducer";
import modalReducer from "scripts/components/modal/reducer";
import snackbarReducer from "scripts/components/snackbar/reducer";
import transactionReducer from "scripts/modules/Transactions/reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducerObj = {
  accounts: accountReducer,
  app: appReducer,
  getStarted: getStartedReducer,
  login: loginReducer,
  modal: modalReducer,
  snackbar: snackbarReducer,
  transactions: transactionReducer,
};

export default createStore(
  combineReducers(reducerObj),
  {},
  composeEnhancers(applyMiddleware(thunk)),
);
