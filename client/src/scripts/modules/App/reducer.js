import Immutable from 'immutable';

import * as defs from './defs';

export const initialState = Immutable.fromJS({
  [defs.PROP_LOGGED_IN]: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onSetLoggedIn: {
      return state.set(defs.PROP_LOGGED_IN, action.value);
    }
    default: {
      return state;
    }
  }
};
