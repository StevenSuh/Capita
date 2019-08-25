import Immutable from "immutable";

import * as defs from "./defs";

export const initialState = Immutable.fromJS({
  [defs.PROP_TRANSACTIONS]: [
    {
      id: 4,
      userId: 1,
      accountId: 1,
      plaidTransactionId: 4,
      transactionType: "place",
      name: "Apple Store - Mac",
      amount: 1299.99,
      isoCurrencyCode: "USD",
      unofficialCurrencyCode: null,
      date: "2019-08-02",
      pending: true,
      recurring: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userId: 1,
      accountId: 1,
      plaidTransactionId: 3,
      transactionType: "place",
      name: "Apple Store - iPhone",
      amount: 299.99,
      isoCurrencyCode: "USD",
      unofficialCurrencyCode: null,
      date: "2019-08-01",
      pending: false,
      recurring: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      accountId: 1,
      plaidTransactionId: 2,
      transactionType: "place",
      name: "Target",
      amount: 102.04,
      isoCurrencyCode: "USD",
      unofficialCurrencyCode: null,
      date: "2019-08-01",
      pending: false,
      recurring: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      userId: 1,
      accountId: 1,
      plaidTransactionId: 1,
      transactionType: "place",
      name: "Best Buy",
      amount: 424.62,
      isoCurrencyCode: "USD",
      unofficialCurrencyCode: null,
      date: "2018-12-02",
      pending: false,
      recurring: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
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
