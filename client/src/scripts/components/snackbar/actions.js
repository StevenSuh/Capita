import { actionTypes, TIMEOUT } from "./defs";

export const addSnackbar = dispatch => (
  message,
  type,
  id = Date.now(),
  infinite = false,
) => {
  dispatch({
    type: actionTypes.onAddSnackbar,
    value: { message, type, id },
  });

  if (!infinite) {
    setTimeout(() => dispatch(removeSnackbar(id)), TIMEOUT);
  }
};

export const removeSnackbar = id => ({
  type: actionTypes.onRemoveSnackbar,
  value: id,
});
