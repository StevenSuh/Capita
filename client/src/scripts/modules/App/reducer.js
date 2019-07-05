import * as defs from './defs';

export const initialState = {
  [defs.PROP_LOGGED_IN]: defs.NOT_LOGGED_IN,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onSetLoggedIn: {
      return {
        ...state,
        [defs.PROP_LOGGED_IN]: action.value,
      };
    }
    default: {
      return state;
    }
  }
};
