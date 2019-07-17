import {
  getConnectedAccounts as getConnectedAccountsApi
} from "scripts/services/api";
import * as defs from "./defs";

export const setAccounts = accounts => ({
  type: defs.actionTypes.onSetAccounts,
  value: accounts,
});

export const addAccount = account => ({
  type: defs.actionTypes.onAddAccount,
  value: account,
});

export const deleteAccount = accountId => ({
  type: defs.actionTypes.onDeleteAccount,
  value: accountId,
});

export const getConnectedAccounts = (force = false) => async (dispatch, getState) => {
  const {
    accounts: accountsReducer,
  } = getState();
  if (!force) {
    const existingAccounts = accountsReducer.get(defs.PROP_ACCOUNTS);
    if (existingAccounts.size > 0) {
      return;
    }
  }

  const userId = accountsReducer.getIn([defs.PROP_ACCOUNTS, 'id']);
  const {
    error,
    accounts,
  } = await getConnectedAccountsApi(dispatch)(userId);
  if (error) {
    return;
  }

  dispatch(setAccounts(accounts));
};