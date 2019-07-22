import Immutable from 'immutable';

import * as defs from './defs';

export const initialState = Immutable.fromJS({
  [defs.PROP_TRANSACTIONS]: [],
  [defs.PROP_RECURRING_EXPENSES]: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onSetTransactions: {
      return state.set(defs.PROP_TRANSACTIONS, Immutable.fromJS(action.value));
    }
    case defs.actionTypes.onAddTransaction: {
      const transactions = state.get(defs.PROP_TRANSACTIONS);

      return state.set(defs.PROP_TRANSACTIONS, transactions.push(Immutable.fromJS(action.value)));
    }
    case defs.actionTypes.onDeleteTransaction: {
      const transactions = state.get(defs.PROP_TRANSACTIONS);
      const index = transactions.findIndex(item => item.get('id') === action.value);

      if (index === -1) {
        return state;
      }
      return state.set(defs.PROP_TRANSACTIONS, transactions.delete(index));
    }
    case defs.actionTypes.onSetRecurringExpenses: {
      const recurringExpenses = state.get(defs.PROP_RECURRING_EXPENSES);

      return state.set(defs.PROP_RECURRING_EXPENSES, recurringExpenses.push(Immutable.fromJS(action.value)));
    }
    default: {
      return state;
    }
  }
};