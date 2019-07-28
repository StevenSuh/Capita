import React from "react";
import { connect } from "react-redux";
import { withLastLocation } from "react-router-last-location";
import classNames from "classnames";
import moment from "moment";

import Chart from "scripts/components/chart";
import Header from "scripts/components/header";
import IsLoading from "scripts/hoc/isLoading";

import * as utils from "utils";
import { ROUTES } from "defs";
import { getDaysInMonth, normalizeTransactions } from "./utils";
import * as transactionActions from "scripts/modules/Transactions/actions";
import { PROP_TRANSACTIONS } from "scripts/modules/Transactions/defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import styles from "./styles.module.css";

class Spending extends React.Component {
  constructor(props) {
    super(props);

    const curr = moment();

    this.state = {
      selected: {
        year: curr.year(),
        month: curr.month(),
      },
    };
  }

  goBack = () =>
    utils.goBack(
      this.props.history,
      ROUTES.APP_DASHBOARD,
      this.props.lastLocation,
    )();

  render() {
    const { onGetTransactions, transactions } = this.props;
    const {
      selected: { year, month },
    } = this.state;

    const days = getDaysInMonth(year, month);
    const amount = normalizeTransactions(transactions, year, month, days);

    return (
      <div>
        <Header
          leftItem={
            <ArrowRightIcon
              className={classNames(styles.icon, "back-btn", "click")}
              onClick={this.goBack}
            />
          }
          title="Spending"
          titleClassName={styles.title}
        />
        <IsLoading className={styles.isLoading} init={onGetTransactions}>
          <div className={styles.main}>
            <div className={classNames(styles.content, "container")}>
              <Chart data={amount} range={days} />
            </div>
          </div>
        </IsLoading>
      </div>
    );
  }
}

export const mapStateToProps = ({ transactions }) => ({
  transactions: transactions
    .get(PROP_TRANSACTIONS)
    .toJS()
    .reverse(),
});

export default connect(
  mapStateToProps,
  {
    onGetTransactions: transactionActions.getTransactions,
  },
)(withLastLocation(Spending));
