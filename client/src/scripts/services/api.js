import axios from "axios";
import queryString from "query-string";

import { addSnackbar } from "scripts/components/snackbar/actions";

import { API_ROUTES, DEFAULT_PAGE_LIMIT, ERROR_MSGS } from "defs";
import { TYPES } from "scripts/components/snackbar/defs";

export const catchApiError = dispatch => error => {
  if (!error.response) {
    error.response = {};
  }

  let message = error.response.data || ERROR_MSGS.default;

  if (typeof message === "object") {
    message = message.msg;
  } else {
    error.response.data = {
      msg: message,
      error: true,
    };
  }

  addSnackbar(dispatch)(message, TYPES.ERROR);
  return error.response;
};

export const checkLogin = dispatch => async () => {
  const res = await axios
    .get(API_ROUTES.USER.LOGIN)
    .catch(catchApiError(dispatch));
  return res.data;
};

export const submitLogin = dispatch => async (email, password) => {
  const res = await axios
    .post(API_ROUTES.USER.LOGIN, {
      email,
      password,
    })
    .catch(catchApiError(dispatch));
  return res.data;
};

export const submitRegister = dispatch => async (name, email, password) => {
  const res = await axios
    .post(API_ROUTES.USER.REGISTER, {
      name,
      email,
      password,
    })
    .catch(catchApiError(dispatch));
  return res.data;
};

export const getConnectedAccounts = dispatch => async userId => {
  const res = await axios
    .get(API_ROUTES.USER.CONNECTED_ACCOUNTS.replace(":userId", userId))
    .catch(catchApiError(dispatch));
  return res.data;
};

export const createInstitutionLink = dispatch => async (
  publicToken,
  accounts,
  institution,
  linkSessionId,
) => {
  const res = await axios
    .post(API_ROUTES.LINK.CREATE, {
      publicToken,
      accounts,
      institution,
      linkSessionId,
    })
    .catch(catchApiError(dispatch));
  return res.data;
};

export const deleteInstitutionLink = dispatch => async institutionLinkId => {
  const res = await axios
    .post(API_ROUTES.LINK.DELETE, { institutionLinkId })
    .catch(catchApiError(dispatch));
  return res.data;
};

export const getTransactions = dispatch => async (
  userId,
  { limit = DEFAULT_PAGE_LIMIT, offset = 0, ...params } = {},
) => {
  const search = queryString.stringify({ ...params, limit, offset });
  const res = await axios
    .get(API_ROUTES.USER.TRANSACTIONS.replace(":userId", userId) + "?" + search)
    .catch(catchApiError(dispatch));
  return res.data;
};
