import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { withLastLocation } from "react-router-last-location";

import Header from "scripts/components/header";
import IsLoading from "scripts/hoc/isLoading";
import TransactionList from "scripts/components/transaction-list";

import * as utils from "utils";
import { ROUTES } from "defs";
import * as actions from "./actions";
import { PROP_TRANSACTIONS } from "./defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import styles from "./styles.module.css";

const Transactions = ({
  history,
  lastLocation,
  location: { search },
  onGetTransactions,
  onGetRecurringTransactions,
  onGetAccountTransactions,
  transactions,
}) => {
  const params = new URLSearchParams(search);
  const recurring = params.get("recurring") === "true";
  const accountId = params.get("accountId");

  let initFn = onGetTransactions;

  if (recurring) {
    initFn = onGetRecurringTransactions;
  }
  if (accountId) {
    initFn = onGetAccountTransactions;
  }

  const goBack = () => {
    utils.goBack(history, ROUTES.APP_DASHBOARD, lastLocation)();
  };

  return (
    <div>
      <Header
        leftItem={
          <ArrowRightIcon
            className={classNames(styles.icon, "back-btn", "click")}
            onClick={goBack}
          />
        }
        title="Transactions"
        titleClassName={styles.title}
      />
      <IsLoading className={styles.isLoading} init={initFn}>
        <div className={styles.main}>
          <div className={classNames(styles.content, "container")}>
            <TransactionList goBack={goBack} transactions={transactions} />
          </div>
        </div>
      </IsLoading>
    </div>
  );
};

export const mapStateToProps = ({ transactions }) => ({
  transactions: transactions.get(PROP_TRANSACTIONS).toJS(),
});

export default connect(
  mapStateToProps,
  {
    onGetTransactions: actions.getTransactions,
    onGetRecurringTransactions: actions.getRecurringTransactions,
    onGetAccountTransactions: actions.getAccountTransactions,
  },
)(withLastLocation(Transactions));
