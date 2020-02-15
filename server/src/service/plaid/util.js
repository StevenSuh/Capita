const plaid = require('plaid');

const { PlaidError } = require('@src/shared/error');

function convertPlaidError(err) {
  if (err instanceof plaid.PlaidError) {
    return new PlaidError(`${err.error_code}: ${err.error_message}`);
  }
  return new PlaidError(err.toString());
}

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

module.exports = {
  convertAccount,
  convertInstitution,
  convertItem,
  convertPlaidError,
};
