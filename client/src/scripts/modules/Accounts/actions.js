import {
  getAccessToken,
  getConnectedAccounts as getConnectedAccountsApi,
} from "scripts/services/api";
import { PROP_USER } from "scripts/modules/App/defs";
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

export const getConnectedAccounts = (force = false) => async (
  dispatch,
  getState,
) => {
  const { app: appReducer, accounts: accountReducer } = getState();
  if (!force) {
    const existingAccounts = accountReducer.get(defs.PROP_ACCOUNTS);
    if (existingAccounts.size > 0) {
      return;
    }
  }

  const userId = appReducer.getIn([PROP_USER, "id"]);
  const { error, accounts } = await getConnectedAccountsApi(dispatch)(userId);
  if (error) {
    return;
  }

  dispatch(setAccounts(accounts));
};

export const exchangePublicToken = (
  publicToken = "",
  { accounts, institution, link_session_id: linkSessionId } = {},
) => async dispatch => {
  await getAccessToken(dispatch)(
    publicToken,
    accounts,
    institution,
    linkSessionId,
  );
};
