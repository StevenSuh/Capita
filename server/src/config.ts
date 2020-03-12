export const plaidClientId = process.env.PLAID_CLIENT_ID;
if (!plaidClientId) {
  throw new Error('PLAID_CLIENT_ID environment variable is not defined');
}

export const plaidPublicKey = process.env.PLAID_PUBLIC_KEY;
if (!plaidPublicKey) {
  throw new Error('PLAID_PUBLIC_KEY environment variable is not defined');
}

export const plaidSecret = process.env.PLAID_SECRET;
if (!plaidSecret) {
  throw new Error('PLAID_SECRET environment variable is not defined');
}

export const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  throw new Error('SECRET_KEY environment variable is not defined');
}
