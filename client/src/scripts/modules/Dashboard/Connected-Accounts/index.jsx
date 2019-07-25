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
            className={styles.empty}
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
                  <div className={styles.plaidLink}>Link an account +</div>
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
  accounts: accounts
    .get(PROP_ACCOUNTS)
    .toJS()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 4),
  user: app.get(PROP_USER).toJS(),
});

export default connect(
  mapStateToProps,
  {
    onExchangePublicToken: accountsActions.exchangePublicToken,
    onGetConnectedAccounts: accountsActions.getConnectedAccounts,
  },
)(withRouter(ConnectedAccounts));
