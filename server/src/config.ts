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

const dbType = process.env.DB_TYPE;
if (!dbType) {
  throw new Error('DB_TYPE environment variable is not defined');
}

const dbHost = process.env.DB_HOST;
if (!dbHost) {
  throw new Error('DB_HOST environment variable is not defined');
}

const dbPort = process.env.DB_PORT;
if (!dbPort) {
  throw new Error('DB_PORT environment variable is not defined');
}

const dbUsername = process.env.DB_USERNAME;
if (!dbUsername) {
  throw new Error('DB_USERNAME environment variable is not defined');
}

const dbPassword = process.env.DB_PASSWORD;
if (!dbPassword) {
  throw new Error('DB_PASSWORD environment variable is not defined');
}

const dbName = process.env.DB_NAME;
if (!dbName) {
  throw new Error('DB_NAME environment variable is not defined');
}

export const dbConfig = {
  type: dbType,
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbName,
};
