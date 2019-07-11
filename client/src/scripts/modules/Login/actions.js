import { setLoggedIn } from 'src/scripts/modules/App/actions';
import { submitLogin } from 'src/scripts/services/api';

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

  let loginError = '';

  if (isAttemptingLogin || !validateLoginForm(dispatch)(email, password)) {
    return;
  }

  dispatch(changeField(defs.PROP_IS_ATTEMPTING_LOGIN, true));
  dispatch(changeField(defs.PROP_LOGIN_ERROR, loginError));

  const { error } = await submitLogin(dispatch)(email, password);
  if (error) {
    loginError = defs.errorMsgs.mismatch;
  } else {
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
    emailError = defs.errorMsgs.required;
    error = true;
  } else {
    emailError = '';
  }

  if (!password) {
    passwordError = defs.errorMsgs.required;
    error = true;
  } else {
    passwordError = '';
  }

  dispatch(changeField(defs.PROP_EMAIL_ERROR, emailError));
  dispatch(changeField(defs.PROP_PASSWORD_ERROR, passwordError));
  return !error;
};
