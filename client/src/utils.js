import moment from "moment";
import { EMAIL_REGEX, PASSWORD_REGEX, CURRENCY_CODES } from "defs";

export const validateEmail = email => email.match(EMAIL_REGEX);

export const validatePassword = password => password.match(PASSWORD_REGEX);

export const goBack = (history, targetLocation, lastLocation) => () => {
  if (lastLocation) {
    history.goBack();
    return;
  }
  history.push(targetLocation);
};

export const convertAmountToCurrency = (amount, currencyCode) => {
  if (typeof amount !== "number") {
    throw new Error(`Invalid number: ${amount}`);
  }
  const currency = CURRENCY_CODES[currencyCode] || "$";
  return `${currency}${Number(amount.toFixed(2)).toLocaleString()}`;
};

export const formatShortDate = date => moment(date).format("MMM D");
export const formatLongDate = date => moment(date).format("MMMM D, YYYY");

/**
 * Linking plaid link on client-side continuously creates <iframe />
 * without knowing that it has been loaded previously.
 *
 * Therefore, due to potential performance issues, we remove obsolete iframes
 * and let the link use the new iframe each time.
 */
export const cleanupPlaidIframe = () => {
  const iframes = document.getElementsByTagName("iframe");

  if (iframes.length > 1) {
    for (let i = 0; i < iframes.length - 1; i++) {
      iframes[i].remove();
    }
  }
};
