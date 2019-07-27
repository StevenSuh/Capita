import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { withLastLocation } from "react-router-last-location";

import Header from "scripts/components/header";
import TransactionList from "scripts/components/transaction-list";

import * as utils from "utils";
import { ROUTES } from "defs";
import { PROP_TRANSACTIONS } from "./defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import styles from "./styles.module.css";

const Transactions = ({ history, lastLocation, transactions }) => {
  const goBack = () => {
    utils.goBack(history, ROUTES.APP_DASHBOARD, lastLocation)();
  };

  return (
    <div className={styles.main}>
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
      <div className={classNames(styles.content, "container")}>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export const mapStateToProps = ({ transactions }) => ({
  transactions: transactions.get(PROP_TRANSACTIONS).toJS(),
});

export default connect(
  mapStateToProps,
  {},
)(withLastLocation(Transactions));
