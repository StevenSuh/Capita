import Immutable from 'immutable';
import * as defs from './defs';

export const initialState = Immutable.fromJS({
  [defs.PROP_SNACKBARS]: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onAddSnackbar: {
      const snackbars = state.get(defs.PROP_SNACKBARS);

      return state.set(defs.PROP_SNACKBARS, snackbars.push(Immutable.fromJS(action.value)));
    }
    case defs.actionTypes.onRemoveSnackbar: {
      const snackbars = state.get(defs.PROP_SNACKBARS);
      const index = snackbars.findIndex(item => item.get('id') === action.value);

      if (index === -1) {
        return state;
      }
      return state.set(defs.PROP_SNACKBARS, snackbars.delete(index));
    }
    default: {
      return state;
    }
  }
};
