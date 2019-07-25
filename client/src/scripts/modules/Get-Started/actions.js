import { setLoggedIn, setUser } from "scripts/modules/App/actions";
import { submitRegister } from "scripts/services/api";

import { validateEmail, validatePassword } from "utils";
import * as defs from "./defs";
import { ERROR_MSGS } from "defs";

export const changeField = (field, value) => ({
  type: defs.actionTypes.onChangeField,
  field,
  value,
});

export const attemptRegister = () => async (dispatch, getState) => {
  const { getStarted } = getState();
  const name = getStarted.get(defs.PROP_NAME);
  const email = getStarted.get(defs.PROP_EMAIL);
  const password = getStarted.get(defs.PROP_PASSWORD);
  const confirmPassword = getStarted.get(defs.PROP_CONFIRM_PASSWORD);
  const isAttemptingRegister = getStarted.get(defs.PROP_IS_ATTEMPTING_REGISTER);

  if (
    isAttemptingRegister ||
    !validateRegisterForm(dispatch)(name, email, password, confirmPassword)
  ) {
    return;
  }

  dispatch(changeField(defs.PROP_IS_ATTEMPTING_REGISTER, true));
  const { error, user } = await submitRegister(dispatch)(name, email, password);
  if (!error) {
    dispatch(setUser(user));
    dispatch(setLoggedIn(true));
  }
  dispatch(changeField(defs.PROP_IS_ATTEMPTING_REGISTER, false));
};

export const validateRegisterForm = dispatch => (
  name,
  email,
  password,
  confirmPassword,
) => {
  let nameError = "";
  let emailError = "";
  let passwordError = "";
  let confirmPasswordError = "";
  let error = false;

  if (!name) {
    nameError = ERROR_MSGS.required;
    error = true;
  } else {
    nameError = "";
  }

  if (!email) {
    emailError = ERROR_MSGS.required;
    error = true;
  } else if (!validateEmail(email)) {
    emailError = ERROR_MSGS.emailInvalid;
    error = true;
  } else {
    emailError = "";
  }

  if (!password) {
    passwordError = ERROR_MSGS.required;
    error = true;
  } else if (!validatePassword(password)) {
    passwordError = ERROR_MSGS.passwordInvalid;
    error = true;
  } else {
    passwordError = "";
  }

  if (passwordError) {
    confirmPasswordError = "";
  } else if (!confirmPassword) {
    confirmPasswordError = ERROR_MSGS.required;
    error = true;
  } else if (confirmPassword !== password) {
    confirmPasswordError = ERROR_MSGS.passwordMismatch;
    error = true;
  } else {
    confirmPasswordError = "";
  }

  dispatch(changeField(defs.PROP_NAME_ERROR, nameError));
  dispatch(changeField(defs.PROP_EMAIL_ERROR, emailError));
  dispatch(changeField(defs.PROP_PASSWORD_ERROR, passwordError));
  dispatch(changeField(defs.PROP_CONFIRM_PASSWORD_ERROR, confirmPasswordError));
  return !error;
};
