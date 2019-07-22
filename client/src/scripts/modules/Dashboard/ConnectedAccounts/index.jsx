import React from "react";
import { connect } from "react-redux";
import PlaidLink from "react-plaid-link";
import classNames from "classnames";

import IsLoading from "scripts/hoc/isLoading";
import Empty from "scripts/components/empty";

import * as accountsActions from "scripts/modules/Accounts/actions";
import { PROP_ACCOUNTS } from "scripts/modules/Accounts/defs";
import { PROP_USER } from "scripts/modules/App/defs";
import { PLAID_OPTIONS } from "defs";

import { ReactComponent as CardIcon } from "assets/icons/credit-card.svg";
import styles from "./styles.module.css";

const ConnectedAccounts = ({
  accounts,
  onExchangePublicToken,
  onGetConnectedAccounts,
  user,
}) => {
  return (
    <IsLoading init={onGetConnectedAccounts}>
      <div className={classNames(styles.main, "container")}>
        {accounts.length ? (
          accounts.map((account, index) => (
            <div key={index}>
              {account}
              {account}
            </div>
          ))
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
  accounts: accounts.get(PROP_ACCOUNTS).toJS(),
  user: app.get(PROP_USER).toJS(),
});

export default connect(
  mapStateToProps,
  {
    onExchangePublicToken: accountsActions.exchangePublicToken,
    onGetConnectedAccounts: accountsActions.getConnectedAccounts,
  },
)(ConnectedAccounts);
