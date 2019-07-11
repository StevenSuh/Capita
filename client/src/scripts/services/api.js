import axios from 'axios';

import { addSnackbar } from 'src/scripts/components/snackbar/actions';

import { API_ROUTES } from 'src/defs';
import { TYPES } from 'src/scripts/components/snackbar/defs';

export const catchApiError = dispatch => ({ message }) => {
  addSnackbar(dispatch)(message, TYPES.ERROR);
  return { data: { error: message }};
};

export const checkLogin = dispatch => async () => {
  const res = await axios.get(API_ROUTES.LOGIN)
    .catch(catchApiError(dispatch));
  
  return res.data;
};

export const submitLogin = dispatch => async (email, password) => {
  const res = await axios.post(API_ROUTES.LOGIN, { email, password })
    .catch(catchApiError(dispatch));

  return res.data;
};
