import React from "react";
import { connect } from "react-redux";
import PlaidLink from "react-plaid-link";
import classNames from "classnames";

import IsLoading from "scripts/hoc/isLoading";
import Empty from "scripts/components/empty";

import * as accountsActions from "scripts/modules/Accounts/actions";
import { PROP_ACCOUNTS } from "scripts/modules/Accounts/defs";
import { PLAID_OPTIONS } from "defs";
import styles from "./styles.module.css";
import { PROP_USER } from "scripts/modules/App/defs";

const ConnectedAccounts = ({ accounts, onGetConnectedAccounts, user }) => {
  return (
    <IsLoading init={onGetConnectedAccounts}>
      <div className={styles.main}>
        {accounts.length ? (
          accounts.map((account, index) => (
            <div key={index}>
              {account}
              {account}
            </div>
          ))
        ) : (
          <Empty
            className={styles.empty}
            message={
              <PlaidLink
                className={classNames("click")}
                style={{}}
                onExit={() => {}}
                onSuccess={(token, metadata) => console.log(token, metadata)}
                user={{
                  legalName: user.name,
                  emailAddress: user.email,
                }}
                {...PLAID_OPTIONS}
              >
                <span className={styles.plaidLink}>Connect</span>
                {" an account to get started"}
              </PlaidLink>
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
    onGetConnectedAccounts: accountsActions.getConnectedAccounts,
  },
)(ConnectedAccounts);
