import Immutable from 'immutable';

import * as defs from './defs';

export const initialState = Immutable.fromJS({
  [defs.PROP_LOGGED_IN]: false,
  [defs.PROP_CHECKED]: false,
  [defs.PROP_USER]: {},
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onSetLoggedIn: {
      return state.set(defs.PROP_LOGGED_IN, action.value);
    }
    case defs.actionTypes.onSetChecked: {
      return state.set(defs.PROP_CHECKED, action.value);
    }
    case defs.actionTypes.onSetUser: {
      return state.set(defs.PROP_USER, Immutable.fromJS(action.value));
    }
    default: {
      return state;
    }
  }
};