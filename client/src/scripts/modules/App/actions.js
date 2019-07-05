import { actionTypes } from './defs';

const setLoggedIn = loggedIn => ({
  type: actionTypes.onSetLoggedIn,
  value: loggedIn,
});

export const checkLoggedIn = () => async dispatch => {
  dispatch(setLoggedIn(true));
};