import axios from "axios";

import {
  addSnackbar,
  removeSnackbar,
} from "scripts/components/snackbar/actions";
import { PROP_SNACKBARS, TYPES } from "scripts/components/snackbar/defs";

export const TIMEOUT = 5000;

export default ({ dispatch, getState }) => next => async action => {
  if (!action.polling) {
    return next(action);
  }

  const { snackbar } = getState();
  if (!snackbar.getIn([PROP_SNACKBARS, action.type])) {
    addSnackbar(dispatch)(action.message, TYPES.INFO, action.type, true);
  }

  const { done } = await axios.get(action.url);
  if (done) {
    removeSnackbar(dispatch)(action.type);
    return dispatch({ ...action, polling: false });
  }

  setTimeout(() => dispatch(action), TIMEOUT);
};
