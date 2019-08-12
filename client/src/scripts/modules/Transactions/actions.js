import { getTransactions as getTransactionsApi } from "scripts/services/api";
import * as defs from "./defs";
import { PROP_USER } from "scripts/modules/App/defs";

export const setTransactions = transactions => ({
  type: defs.actionTypes.onSetTransactions,
  value: transactions,
});

export const addTransaction = transaction => ({
  type: defs.actionTypes.onAddTransaction,
  value: transaction,
});

export const deleteTransaction = transactionId => ({
  type: defs.actionTypes.onDeleteTransaction,
  value: transactionId,
});

export const setRecurringTransactions = transactions => ({
  type: defs.actionTypes.onSetRecurringTransactions,
  value: transactions,
});

export const setAccountTransactions = (accountId, transactions) => ({
  type: defs.actionTypes.onSetAccountTransactions,
  value: transactions,
  query: [accountId],
});

// TODO: set force to true
export const getTransactions = (force = false, params) => async (
  dispatch,
  getState,
) => {
  const { app: appReducer, transactions: transactionReducer } = getState();
  if (!force) {
    const existingTransactions = transactionReducer
      .get(defs.PROP_TRANSACTIONS)
      .toJS();
    if (existingTransactions.length > 0) {
      return;
    }
  }

  const userId = appReducer.getIn([PROP_USER, "id"]);
  const { error, transactions } = await getTransactionsApi(dispatch)(
    userId,
    params,
  );

  if (error) {
    return;
  }

  dispatch(setTransactions(transactions));
};
