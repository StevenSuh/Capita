import Immutable from "immutable";

import * as defs from "./defs";

export const initialState = Immutable.fromJS({
  [defs.PROP_TRANSACTIONS]: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onSetTransactions: {
      return state.set(defs.PROP_TRANSACTIONS, Immutable.fromJS(action.value));
    }
    case defs.actionTypes.onAddTransaction: {
      const transactions = state.get(defs.PROP_TRANSACTIONS);

      return state.set(
        defs.PROP_TRANSACTIONS,
        transactions.push(Immutable.fromJS(action.value)),
      );
    }
    case defs.actionTypes.onDeleteTransaction: {
      const transactions = state.get(defs.PROP_TRANSACTIONS);
      const index = transactions.findIndex(
        item => item.get("id") === action.value,
      );

      if (index === -1) {
        return state;
      }
      return state.set(defs.PROP_TRANSACTIONS, transactions.delete(index));
    }
    default: {
      return state;
    }
  }
};
