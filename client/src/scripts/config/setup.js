/* eslint no-underscore-dangle: ["error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] }] */
import {
  combineReducers, applyMiddleware, createStore, compose,
} from 'redux';
import thunk from 'redux-thunk';

import appReducer from 'src/scripts/modules/App/reducer';
import loginReducer from 'src/scripts/modules/Login/reducer';
import snackbarReducer from 'src/scripts/components/snackbar/reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducerObj = {
  app: appReducer,
  login: loginReducer,
  snackbar: snackbarReducer,
};

export default createStore(
  combineReducers(reducerObj),
  {},
  composeEnhancers(applyMiddleware(
    thunk,
  )),
);