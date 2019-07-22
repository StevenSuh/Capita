export const ROUTES = {
  LANDING: "/",
  APP: "/app",
  APP_DASHBOARD: "/app/main",
  LOGIN: "/app/login",
  GET_STARTED: "/app/get-started",
  FORGOT_PASSWORD: "/app/forgot-password",
  ACCOUNTS: "/app/accounts",
  TRANSFER: "/app/transfer",
  TRANSACTIONS: "/app/transactions",
  SPENDING: "/app/spending",
};

export const API_ROUTES = {
  LOGIN: "/api/user/login",
  REGISTER: "/api/user/register",
  CONNECTED_ACCOUNTS: "/api/user/:userId/accounts",
  TRANSACTIONS: "/api/user/:userId/transactions",
  PLAID: {
    GET_ACCESS_TOKEN: "/api/plaid/get_access_token",
    WEBHOOK: "/api/plaid/webhook",
  },
};

export const ERROR_MSGS = {
  default: "An error has occurred - please try again later",
  required: "This field is required",
  mismatch: "Your email or password is incorrect",
  emailInvalid: "Email address is invalid",
  passwordInvalid:
    "Password must be at least 8 characters, including 1 uppercase letter, 1 special character, and alphanumeric characters",
  passwordMismatch: "Password is incorrect",
};

export const EMAIL_REGEX = `^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$`;

export const PASSWORD_REGEX = `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*@!#%&()^~{}])[0-9a-zA-Z*@!#%&()^~{}]{8,}$`;

console.log("Plaid:", process.env.REACT_APP_PLAID_ENV);

export const PLAID_OPTIONS = {
  clientName: "Capita",
  env: process.env.REACT_APP_PLAID_ENV,
  product: ["auth", "transactions"],
  publicKey: process.env.REACT_APP_PLAID_PUBLIC_KEY,
  // webhook: API_ROUTES.PLAID.WEBHOOK,
};
