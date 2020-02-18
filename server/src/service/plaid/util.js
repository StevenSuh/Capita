const plaid = require('plaid');

const { PlaidError } = require('@src/shared/error');

/**
 * Convert error from plaid requests.
 *
 * @param {plaid.PlaidError|any} err - Potential plaid error.
 * @returns {PlaidError} - Error.
 */
function convertPlaidError(err) {
  if (err instanceof plaid.PlaidError) {
    return new PlaidError(`${err.error_code}: ${err.error_message}`);
  }
  return new PlaidError(err.toString());
}

/**
 * Convert plaid account.
 *
 * @param {object} account - Plaid account.
 * @returns {object} - account object.
 */
function convertAccount(account) {
  const balances = account.balances || {};
  return {
    id: account.account_id,
    mask: account.mask,
    name: account.name,
    officialName: account.official_name,
    subtype: account.subtype,
    type: account.type,
    verificationStatus: account.verification_status,
    balances: {
      available: balances.available,
      current: balances.current,
      limit: balances.limit,
      isoCurrencyCode: balances.iso_currency_code,
      unofficialCurrencyCode: balances.unofficial_currency_code,
    },
  };
}

/**
 * Convert plaid item.
 *
 * @param {object} item - Plaid item.
 * @returns {object} - item object.
 */
function convertItem(item) {
  return {
    id: item.item_id,
    availableProducts: item.available_products,
    billedProducts: item.billed_products,
    error: item.error,
    institutionId: item.institution_id,
    webhook: item.webhook,
    consentExpirationItem: item.consent_expiration_time,
  };
}

/**
 * Convert plaid institution.
 *
 * @param {object} institution - Plaid institution.
 * @returns {object} - institution object.
 */
function convertInstitution(institution) {
  return {
    id: institution.institution_id,
    name: institution.name,
    products: institution.products,
    url: institution.url,
    color: institution.primary_color,
    logo: institution.logo,
  };
}

/**
 * Convert plaid location.
 *
 * @param {object} location - Plaid location.
 * @returns {object} - location object.
 */
function convertLocation(location) {
  return {
    address: location.address,
    city: location.city,
    lat: location.lat,
    lon: location.lon,
    region: location.region,
    storeNumber: location.store_number,
    postalCode: location.postal_code,
    country: location.country,
  };
}

/**
 * Convert plaid transaction.
 *
 * @param {object} transaction - Plaid transaction.
 * @returns {object} - transaction object.
 */
function convertTransaction(transaction) {
  return {
    id: transaction.transaction_id,
    type: transaction.type,
    accountId: transaction.account_id,
    accountOwner: transaction.account_owner,
    amount: transaction.amount,
    isoCurrencyCode: transaction.iso_currency_code,
    unofficialCurrencyCode: transaction.unofficial_currency_code,
    category: transaction.category,
    categoryId: transaction.categoryId,
    date: transaction.date,
    location: convertLocation(transaction.location),
    name: transaction.name,
    paymentMeta: {
      byOrderOf: transaction.payment_meta.by_order_of,
      payee: transaction.payment_meta.payee,
      payer: transaction.payment_meta.payer,
      paymentMethod: transaction.payment_meta.payment_method,
      paymentProcessor: transaction.payment_meta.payment_processor,
      ppdId: transaction.payment_meta.ppd_id,
      reason: transaction.payment_meta.reason,
      referenceNumber: transaction.payment_meta.reference_number,
    },
    pending: transaction.pending,
    pendingTransactionId: transaction.pending_transaction_id,
  };
}

module.exports = {
  convertAccount,
  convertInstitution,
  convertItem,
  convertPlaidError,
  convertTransaction,
};
