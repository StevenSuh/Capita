import axios from 'axios';

import { setLoggedIn } from 'src/scripts/modules/App/actions';
import { catchApiError } from 'src/scripts/components/snackbar/actions';

import { API_ROUTES } from 'src/defs';
import * as defs from './defs';

export const changeField = (field, value) => ({
  type: defs.actionTypes.onChangeField,
  field, value,
});

export const attemptLogin = () => async (dispatch, getState) => {
  const { login } = getState();
  const email = login.get(defs.PROP_EMAIL);
  const password = login.get(defs.PROP_PASSWORD);
  const isAttemptingLogin = login.get(defs.PROP_IS_ATTEMPTING_LOGIN);

  if (isAttemptingLogin || !validateLoginForm(dispatch)(email, password)) {
    return;
  }

  dispatch(changeField(defs.PROP_IS_ATTEMPTING_LOGIN, true));
  await submitLogin(dispatch)(email, password);
  dispatch(changeField(defs.PROP_IS_ATTEMPTING_LOGIN, false));
};

export const validateLoginForm = dispatch => (email, password) => {
  let emailError = '';
  let passwordError = '';
  let error = false;

  if (!email) {
    emailError = 'This field is required';
    error = true;
  } else {
    emailError = '';
  }

  if (!password) {
    passwordError = 'This field is required';
    error = true;
  } else {
    passwordError = '';
  }

  dispatch(changeField(defs.PROP_EMAIL_ERROR, emailError));
  dispatch(changeField(defs.PROP_PASSWORD_ERROR, passwordError));
  return !error;
};

export const submitLogin = dispatch => async (email, password) => {
  const res = await axios.post(API_ROUTES.LOGIN, { email, password })
    .catch(catchApiError(dispatch));

  if (res.data.error) {
    return;
  }

  dispatch(setLoggedIn(true));
};