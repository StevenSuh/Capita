import { actionTypes, TYPES, TIMEOUT } from './defs';

export const addSnackbar = dispatch => (message, type) => {
  const id = Date.now();

  dispatch({
    type: actionTypes.onAddSnackbar,
    value: { message, type, id },
  });
  setTimeout(() => dispatch(removeSnackbar(id)), TIMEOUT);
};

export const removeSnackbar = id => ({
  type: actionTypes.onRemoveSnackbar,
  value: id,
});

export const catchApiError = dispatch => ({ message }) => {
  addSnackbar(dispatch)(message, TYPES.ERROR);
  return { data: { error: message }};
};
