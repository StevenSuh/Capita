import Immutable from 'immutable';

import * as defs from './defs';

export const initialState = Immutable.fromJS({
  [defs.PROP_EMAIL]: '',
  [defs.PROP_EMAIL_ERROR]: '',
  [defs.PROP_PASSWORD]: '',
  [defs.PROP_PASSWORD_ERROR]: '',
  [defs.PROP_IS_ATTEMPTING_LOGIN]: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onChangeField: {
      return state.set(action.field, action.value);
    }
    default: {
      return state;
    }
  }
};