import Immutable from 'immutable';

import * as defs from './defs';

export const initialState = Immutable.fromJS({
  [defs.PROP_ACCOUNTS]: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onSetAccounts: {
      return state.set(defs.PROP_ACCOUNTS, Immutable.fromJS(action.value));
    }
    case defs.actionTypes.onAddAccount: {
      const accounts = state.get(defs.PROP_ACCOUNTS);

      return state.set(defs.PROP_ACCOUNTS, accounts.push(Immutable.fromJS(action.value)));
    }
    case defs.actionTypes.onDeleteAccount: {
      const accounts = state.get(defs.PROP_ACCOUNTS);
      const index = accounts.findIndex(item => item.get('id') === action.value);

      if (index === -1) {
        return state;
      }
      return state.set(defs.PROP_ACCOUNTS, accounts.delete(index));
    }
    default: {
      return state;
    }
  }
};