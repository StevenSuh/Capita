import React from "react";
import { connect } from "react-redux";
import PlaidLink from "react-plaid-link";
import classNames from "classnames";
import { withRouter } from "react-router-dom";

import IsLoading from "scripts/hoc/isLoading";
import Empty from "scripts/components/empty";

import * as utils from "utils";
import * as accountsActions from "scripts/modules/Accounts/actions";
import { PROP_ACCOUNTS } from "scripts/modules/Accounts/defs";
import { PROP_USER } from "scripts/modules/App/defs";
import { PLAID_OPTIONS, ROUTES } from "defs";

import ActionRow from "scripts/components/action-row";

import { ReactComponent as CardIcon } from "assets/icons/credit-card.svg";
import styles from "./styles.module.css";

const ConnectedAccounts = ({
  accounts,
  history,
  onExchangePublicToken,
  onGetConnectedAccounts,
  user,
}) => {
  return (
    <IsLoading init={onGetConnectedAccounts}>
      <div className={styles.main}>
        {accounts.length ? (
          accounts.map(
            (
              {
                balanceAvailable,
                balanceCurrent,
                id,
                mask,
                institutionLogo,
                subtype,
              },
              index,
            ) => (
              <ActionRow
                border={false}
                left={true}
                title={`${subtype} - ${mask}`}
                titleClassName={styles.account_title}
                key={index}
                leftItem={
                  <img
                    src={institutionLogo}
                    className={styles.institution_logo}
                    alt="institution logo"
                  />
                }
                rightItem={
                  <p className={styles.balance}>
                    {utils.convertAmountToCurrency(
                      balanceAvailable || balanceCurrent,
                    )}
                  </p>
                }
                onMainClick={() =>
                  history.push(ROUTES.ACCOUNT_ITEM.replace(":account_id", id))
                }
              />
            ),
          )
        ) : (
          <Empty
            icon={<CardIcon className={styles.icon} />}
            message={
              <div>
                <div>No accounts linked</div>
                <PlaidLink
                  className={classNames("click")}
                  style={{}}
                  onExit={() => {}}
                  onLoad={utils.cleanupPlaidIframe}
                  onSuccess={onExchangePublicToken}
                  user={{
                    legalName: user.name,
                    emailAddress: user.email,
                  }}
                  {...PLAID_OPTIONS}
                >
                  <div className={styles.plaidLink}>Add an account +</div>
                </PlaidLink>
              </div>
            }
          />
        )}
      </div>
    </IsLoading>
  );
};

export const mapStateToProps = ({ app, accounts }) => ({
  // accounts: accounts.get(PROP_ACCOUNTS).toJS().slice(0, 3),
  accounts: [
    {
      id: 1,
      userId: 1,
      institutionLinkId: 1,
      plaidAccountId: "account-1",
      active: true,
      mask: "4444",
      name: "Checking",
      officialName: "Bank of America Checking",
      subtype: "checking",
      type: "depository",
      verificationStatus: "automatically_verified",
      balanceAvailable: null || 100.42,
      balanceCurrent: 120.0,
      balanceLimit: null,
      balanceISOCurrencyCode: "USD",
      balanceUnofficialCurrencyCode: null,
      apy: 0.02,
      withdrawalLimit: null,
      minimumBalance: null,
      notificationEnabled: true,
      transactionAlertEnabled: true,
      withdrawalLimitAlertEnabled: true,
      minimumBalanceAlertEnabled: true,
      creditLimitAlertEnabled: true,
      institutionLogo:
        "data:image/png;base64,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",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      userId: 1,
      institutionLinkId: 1,
      plaidAccountId: "account-1",
      active: true,
      mask: "4444",
      name: "Checking",
      officialName: "Bank of America Checking",
      subtype: "checking",
      type: "depository",
      verificationStatus: "automatically_verified",
      balanceAvailable: null || 100.42,
      balanceCurrent: 120.0,
      balanceLimit: null,
      balanceISOCurrencyCode: "USD",
      balanceUnofficialCurrencyCode: null,
      apy: 0.02,
      withdrawalLimit: null,
      minimumBalance: null,
      notificationEnabled: true,
      transactionAlertEnabled: true,
      withdrawalLimitAlertEnabled: true,
      minimumBalanceAlertEnabled: true,
      creditLimitAlertEnabled: true,
      institutionLogo:
        "data:image/png;base64,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",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      userId: 1,
      institutionLinkId: 1,
      plaidAccountId: "account-1",
      active: true,
      mask: "4444",
      name: "Checking",
      officialName: "Bank of America Checking",
      subtype: "checking",
      type: "depository",
      verificationStatus: "automatically_verified",
      balanceAvailable: null || 100.42,
      balanceCurrent: 120.0,
      balanceLimit: null,
      balanceISOCurrencyCode: "USD",
      balanceUnofficialCurrencyCode: null,
      apy: 0.02,
      withdrawalLimit: null,
      minimumBalance: null,
      notificationEnabled: true,
      transactionAlertEnabled: true,
      withdrawalLimitAlertEnabled: true,
      minimumBalanceAlertEnabled: true,
      creditLimitAlertEnabled: true,
      institutionLogo:
        "data:image/png;base64,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",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  user: app.get(PROP_USER).toJS(),
});

export default connect(
  mapStateToProps,
  {
    onExchangePublicToken: accountsActions.exchangePublicToken,
    onGetConnectedAccounts: accountsActions.getConnectedAccounts,
  },
)(withRouter(ConnectedAccounts));
