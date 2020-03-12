import { IPlaidError } from 'plaid';

export interface PlaidAccount {
  id: string;
  mask: string | null;
  name: string;
  officialName: string | null;
  subtype: string;
  type: string;
  verificationStatus: string;
  balances: {
    available: number | null;
    current: number;
    limit: number | null;
    isoCurrencyCode: string | null;
    unofficialCurrencyCode: string | null;
  };
}

export interface PlaidItem {
  id: string;
  availableProducts: string[];
  billedProducts: string[];
  error: IPlaidError | null;
  institutionId: string;
  webhook: string;
  consentExpirationItem: string | null;
}

export interface PlaidInstitution {
  id: string;
  name: string;
  products: string[];
  url: string | null;
  color: string | null;
  logo: string | null;
}

export interface PlaidLocation {
  address: string | null;
  city: string | null;
  lat: number | null;
  lon: number | null;
  region: string | null;
  storeNumber: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface PlaidTransaction {
  id: string;
  type: string;
  accountId: string;
  accountOwner: string | null;
  amount: number;
  isoCurrencyCode: string | null;
  unofficialCurrencyCode: string | null;
  category: string[] | null;
  categoryId: string | null;
  date: string;
  location: PlaidLocation;
  name: string;
  paymentMeta: {
    byOrderOf: string | null;
    payee: string | null;
    payer: string | null;
    paymentMethod: string | null;
    paymentProcessor: string | null;
    ppdId: string | null;
    reason: string | null;
    referenceNumber: string | null;
  };
  pending: boolean;
  pendingTransactionId: string | null;
}
