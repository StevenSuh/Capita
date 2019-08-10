import {
  createInstitutionLink as createInstitutionLinkApi,
  deleteInstitutionLink as deleteInstitutionLinkApi,
  getConnectedAccounts as getConnectedAccountsApi,
} from "scripts/services/api";

import { PROP_USER } from "scripts/modules/App/defs";
import * as defs from "./defs";
import { API_ROUTES } from "defs";

export const setAccounts = accounts => ({
  type: defs.actionTypes.onSetAccounts,
  value: accounts,
});

export const addAccounts = accounts => ({
  type: defs.actionTypes.onAddAccounts,
  value: accounts,
});

export const deleteAccounts = accountIds => ({
  type: defs.actionTypes.onDeleteAccounts,
  value: accountIds,
});

export const setIsEditing = isEditing => ({
  type: defs.actionTypes.onSetIsEditing,
  value: isEditing,
});

export const setIsDeletingLink = isDeletingLink => ({
  type: defs.actionTypes.onSetIsDeletingLink,
  value: isDeletingLink,
});

export const selectAccount = selectedAccount => ({
  type: defs.actionTypes.onSelectAccount,
  value: selectedAccount,
});

export const setIsReady = isReady => ({
  type: defs.actionTypes.onSetIsReady,
  value: isReady,
  message: "An account is currently syncing with Capita (takes ~30 seconds)",
  polling: !isReady,
  url: API_ROUTES.LINK.POLLING,
});

export const getConnectedAccounts = (force = false) => async (
  dispatch,
  getState,
) => {
  const { app: appReducer, accounts: accountReducer } = getState();
  if (!force) {
    const existingAccounts = accountReducer.get(defs.PROP_ACCOUNTS).toJS();
    if (existingAccounts.length > 0) {
      return;
    }
  }

  const userId = appReducer.getIn([PROP_USER, "id"]);
  const { error, accounts, ready, update = [] } = await getConnectedAccountsApi(
    dispatch,
  )(userId);
  if (error) {
    return;
  }

  update.forEach(institutionLinkId => {
    const account = accounts.find(
      account => account.institutionLinkId === institutionLinkId,
    );
    if (account) {
      account.update = true;
    }
  });

  dispatch(setAccounts(accounts));
  dispatch(setIsReady(ready));
};

export const createInstitutionLink = (
  publicToken = "",
  {
    institution: { institution_id: institutionId },
    link_session_id: linkSessionId,
  },
) => async dispatch => {
  const { error, accounts, ready } = await createInstitutionLinkApi(dispatch)(
    publicToken,
    institutionId,
    linkSessionId,
  );
  if (error) {
    return;
  }

  dispatch(addAccounts(accounts));
  dispatch(setIsReady(ready));
};

export const deleteInstitutionLink = () => async (dispatch, getState) => {
  const { accounts: accountReducer } = getState();
  const selectedAccount = accountReducer.get(defs.PROP_SELECTED_ACCOUNT).toJS();
  const isDeletingLink = accountReducer.get(defs.PROP_IS_DELETING_LINK);

  if (isDeletingLink || !selectedAccount.id) {
    return;
  }

  dispatch(setIsDeletingLink(true));
  const { error } = await deleteInstitutionLinkApi(
    selectedAccount.institutionLinkId,
  );
  if (!error) {
    dispatch(selectAccount({}));
  }
  dispatch(setIsDeletingLink(false));
};
