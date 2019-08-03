import history from "scripts/config/history";
import { checkLogin } from "scripts/services/api";

import * as defs from "./defs";
import { ROUTES } from "defs";

export const setUser = user => ({
  type: defs.actionTypes.onSetUser,
  value: user,
});

export const setLoggedIn = loggedIn => ({
  type: defs.actionTypes.onSetLoggedIn,
  value: loggedIn,
});

export const setChecked = checked => ({
  type: defs.actionTypes.onSetChecked,
  value: checked,
});

export const checkLoggedIn = () => async (dispatch, getState) => {
  const { app } = getState();
  const loggedIn = app.get(defs.PROP_LOGGED_IN);
  const checked = app.get(defs.PROP_CHECKED);

  if (loggedIn || checked) {
    return;
  }

  const { error, user } = await checkLogin(dispatch)();
  dispatch(setChecked(true));

  if (error) {
    return;
  }

  dispatch(setUser(user));
  dispatch(setLoggedIn(true));
};

export const redirectByStatus = () => (_, getState) => {
  const { app } = getState();
  const loggedIn = app.get(defs.PROP_LOGGED_IN);

  const isLoginPage = [
    ROUTES.APP,
    ROUTES.LOGIN,
    ROUTES.GET_STARTED,
    ROUTES.FORGOT_PASSWORD,
  ].includes(window.location.pathname);

  if (loggedIn && isLoginPage) {
    history.push(ROUTES.APP_DASHBOARD);
  }
  if (!loggedIn && !isLoginPage) {
    history.push(ROUTES.APP);
  }
};
