import React from "react";
import { connect } from "react-redux";
import { withLastLocation } from "react-router-last-location";
import classNames from "classnames";
import moment from "moment";

import Chart from "scripts/components/chart";
import Header from "scripts/components/header";
import IsLoading from "scripts/hoc/isLoading";
import Modal from "scripts/components/modal";
import Summary from "scripts/components/spending-summary";
import Ticker from "scripts/components/ticker";

import * as utils from "utils";
import { ROUTES, MODAL_NAMES } from "defs";
import { getDaysInMonth, filterTransactions } from "./utils";
import * as modalActions from "scripts/components/modal/actions";
import * as transactionActions from "scripts/modules/Transactions/actions";
import { PROP_TRANSACTIONS } from "scripts/modules/Transactions/defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import { ReactComponent as MoreIcon } from "assets/icons/more-horizontal.svg";
import styles from "./styles.module.css";

class Spending extends React.Component {
  constructor(props) {
    super(props);

    const { transactions } = this.props;
    const curr = moment();
    const year = curr.year();
    const month = curr.month();

    const days = getDaysInMonth(year, month);
    const [items, amounts, adjustedDays] = filterTransactions(
      transactions,
      year,
      month,
      days,
    );

    this.state = {
      daysInMonth: adjustedDays,
      amounts,
      currAmount: items.reduce((curr, { amount }) => curr + amount, 0),
      monthTransactions: items,
      selected: { year, month },
    };
  }

  onChartDetect = value => {
    if (value !== this.state.currAmount) {
      this.setState({ currAmount: value });
    }
  };

  onChartDetectReset = () => {
    const { monthTransactions: items } = this.state;
    this.setState({
      currAmount: items.reduce((curr, { amount }) => curr + amount, 0),
    });
  };

  goBack = () =>
    utils.goBack(
      this.props.history,
      ROUTES.APP_DASHBOARD,
      this.props.lastLocation,
    )();

  render() {
    const {
      history,
      onGetTransactions,
      onOpenModal,
      onCloseModal,
    } = this.props;
    const {
      daysInMonth,
      amounts,
      currAmount = 0,
      monthTransactions,
      // selected: { year, month },
    } = this.state;

    return (
      <div>
        <Header
          title="Spending"
          titleClassName={styles.title}
          leftItem={
            <ArrowRightIcon
              className={classNames(styles.icon, "back-btn", "click")}
              onClick={this.goBack}
            />
          }
          rightItem={
            <MoreIcon
              className="click"
              onClick={() => onOpenModal(MODAL_NAMES.SPENDING_OPTIONS)}
            />
          }
        />
        <IsLoading className={styles.isLoading} init={onGetTransactions}>
          <div className={styles.main}>
            <div className={classNames(styles.content, "container")}>
              <div className={styles.spent}>
                <p className={styles.spent_p}>You spent</p>
                <Ticker amount={currAmount} className={styles.total_amount} />
              </div>
              <Chart
                data={amounts}
                range={daysInMonth}
                onDetectValue={this.onChartDetect}
                onDetectReset={this.onChartDetectReset}
                allowXOut={true}
              />
              <Summary transactions={monthTransactions} />
            </div>
          </div>
        </IsLoading>
        <Modal bottom={true} modalName={MODAL_NAMES.SPENDING_OPTIONS}>
          <div
            className={classNames(styles.option_row, "click-bg")}
            onClick={() => {
              onCloseModal(MODAL_NAMES.SPENDING_OPTIONS);
              history.push(ROUTES.BUDGET);
            }}
          >
            Budget
          </div>
        </Modal>
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
    onOpenModal: modalActions.openModal,
    onCloseModal: modalActions.closeModal,
  },
)(withLastLocation(Spending));
