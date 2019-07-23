import { EMAIL_REGEX, PASSWORD_REGEX } from "defs";

export const validateEmail = email => email.match(EMAIL_REGEX);

export const validatePassword = password => password.match(PASSWORD_REGEX);

export const goBack = (history, targetLocation, lastLocation) => () => {
  if (lastLocation) {
    history.goBack();
    return;
  }
  history.push(targetLocation);
};
