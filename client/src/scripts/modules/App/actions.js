import { actionTypes } from './defs';

export const setLoggedIn = loggedIn => ({
  type: actionTypes.onSetLoggedIn,
  value: loggedIn,
});

export const checkLoggedIn = () => async dispatch => {
  dispatch(setLoggedIn(false));
};
