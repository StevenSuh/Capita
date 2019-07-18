import {
  setLoggedIn,
  setUser
} from 'scripts/modules/App/actions';
import {
  submitLogin
} from 'scripts/services/api';

import {
  validateEmail,
  validatePassword
} from 'utils';
import * as defs from './defs';
import {
  ERROR_MSGS
} from 'defs';

export const changeField = (field, value) => ({
  type: defs.actionTypes.onChangeField,
  field,
  value,
});

export const attemptLogin = () => async (dispatch, getState) => {
  const {
    login
  } = getState();
  const email = login.get(defs.PROP_EMAIL);
  const password = login.get(defs.PROP_PASSWORD);
  const isAttemptingLogin = login.get(defs.PROP_IS_ATTEMPTING_LOGIN);

  let loginError = '';

  if (isAttemptingLogin || !validateLoginForm(dispatch)(email, password)) {
    return;
  }

  dispatch(changeField(defs.PROP_IS_ATTEMPTING_LOGIN, true));

  const {
    error,
    user,
  } = await submitLogin(dispatch)(email, password);
  if (error) {
    loginError = ERROR_MSGS.mismatch;
  } else {
    dispatch(setUser(user));
    dispatch(setLoggedIn(true));
  }

  dispatch(changeField(defs.PROP_LOGIN_ERROR, loginError));
  dispatch(changeField(defs.PROP_IS_ATTEMPTING_LOGIN, false));
};

export const validateLoginForm = dispatch => (email, password) => {
  let emailError = '';
  let passwordError = '';
  let error = false;

  if (!email) {
    emailError = ERROR_MSGS.required;
    error = true;
  } else if (!validateEmail(email)) {
    emailError = ERROR_MSGS.emailInvalid;
    error = true;
  } else {
    emailError = '';
  }

  if (!password) {
    passwordError = ERROR_MSGS.required;
    error = true;
  } else if (!validatePassword(password)) {
    passwordError = ERROR_MSGS.passwordInvalid;
    error = true;
  } else {
    passwordError = '';
  }

  dispatch(changeField(defs.PROP_EMAIL_ERROR, emailError));
  dispatch(changeField(defs.PROP_PASSWORD_ERROR, passwordError));
  return !error;
};