import React, { useEffect } from "react";
import PlaidLink from "react-plaid-link";

import { cleanupPlaidIframe } from "utils";

export default props => {
  useEffect(() => cleanupPlaidIframe, []);

  return <PlaidLink {...props} />;
};
