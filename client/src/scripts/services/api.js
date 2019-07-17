import axios from 'axios';

import {
  addSnackbar
} from 'scripts/components/snackbar/actions';

import {
  API_ROUTES
} from 'defs';
import {
  TYPES
} from 'scripts/components/snackbar/defs';

export const catchApiError = dispatch => error => {
  let message = error.response.data;

  if (typeof message === 'object') {
    message = message.msg;
  } else {
    error.response.data = {
      msg: message,
      error: true,
    };
  }

  addSnackbar(dispatch)(message, TYPES.ERROR);
  return error.response;
};

export const checkLogin = dispatch => async () => {
  const res = await axios.get(API_ROUTES.LOGIN)
    .catch(catchApiError(dispatch));

  return res.data;
};

export const submitLogin = dispatch => async (email, password) => {
  const res = await axios.post(API_ROUTES.LOGIN, {
      email,
      password
    })
    .catch(catchApiError(dispatch));

  return res.data;
};

export const submitRegister = dispatch => async (name, email, password) => {
  const res = await axios.post(API_ROUTES.REGISTER, {
      name,
      email,
      password
    })
    .catch(catchApiError(dispatch));

  return res.data;
};

export const getConnectedAccounts = dispatch => async id => {
  const res = await axios.get(API_ROUTES.CONNECTED_ACCOUNTS.replace(':userId', id))
    .catch(catchApiError(dispatch));

  return res.data;
};