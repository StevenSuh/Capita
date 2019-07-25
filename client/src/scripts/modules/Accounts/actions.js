import {
  createInstitutionLink,
  deleteInstitutionLink as deleteInstitutionLinkApi,
  getConnectedAccounts as getConnectedAccountsApi,
} from "scripts/services/api";
import { PROP_USER } from "scripts/modules/App/defs";
import * as defs from "./defs";
import { TimeoutError } from "rxjs";

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

export const getConnectedAccounts = (force = false) => async (
  dispatch,
  getState,
) => {
  const { app: appReducer, accounts: accountReducer } = getState();
  if (!force) {
    const existingAccounts = accountReducer.get(defs.PROP_ACCOUNTS).toJS();
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
  await createInstitutionLink(dispatch)(
    publicToken,
    accounts,
    institution,
    linkSessionId,
  );
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
