import Immutable from "immutable";

import * as defs from "./defs";

export const initialState = Immutable.fromJS({
  [defs.PROP_ACCOUNTS]: [],
  [defs.PROP_IS_EDITING]: false,
  [defs.PROP_IS_DELETING_LINK]: false,
  [defs.PROP_SELECTED_ACCOUNT]: {},
  [defs.PROP_IS_READY]: true,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onSetAccounts: {
      return state.set(defs.PROP_ACCOUNTS, Immutable.fromJS(action.value));
    }
    case defs.actionTypes.onAddAccounts: {
      const accounts = state.get(defs.PROP_ACCOUNTS);

      return state.set(
        defs.PROP_ACCOUNTS,
        accounts.concat(Immutable.fromJS(action.value)),
      );
    }
    case defs.actionTypes.onDeleteAccounts: {
      const accounts = state.get(defs.PROP_ACCOUNTS);

      return state.set(
        defs.PROP_ACCOUNTS,
        accounts.filter(item => !action.value.includes(item.get("id"))),
      );
    }
    case defs.actionTypes.onSetIsEditing: {
      // reset selected account as well
      return state
        .set(defs.PROP_SELECTED_ACCOUNT, Immutable.fromJS({}))
        .set(defs.PROP_IS_EDITING, action.value);
    }
    case defs.actionTypes.onSetIsDeletingLink: {
      return state.set(defs.PROP_IS_DELETING_LINK, action.value);
    }
    case defs.actionTypes.onSetIsReady: {
      return state.set(defs.PROP_IS_READY, action.value);
    }
    case defs.actionTypes.onSelectAccount: {
      return state.set(
        defs.PROP_SELECTED_ACCOUNT,
        Immutable.fromJS(action.value),
      );
    }
    default: {
      return state;
    }
  }
};
