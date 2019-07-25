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

export const getTransactions = (force = false, limit, offset) => async (
  dispatch,
  getState,
) => {
  const { app: appReducer, transactions: transactionReducer } = getState();
  if (!force) {
    const existingTransactions = transactionReducer
      .get(defs.PROP_TRANSACTIONS)
      .toJS();
    if (existingTransactions.size > 0) {
      return;
    }
  }

  const userId = appReducer.getIn([PROP_USER, "id"]);
  const { error, transactions } = await getTransactionsApi(dispatch)(
    userId,
    limit,
    offset,
  );
  if (error) {
    return;
  }

  dispatch(setTransactions(transactions));
};
