import React from "react";
import moment from "moment";
import classNames from "classnames";
import { withRouter } from "react-router-dom";

import ActionRow from "scripts/components/action-row";
import Nav from "scripts/components/nav";
import SelectButton from "scripts/components/select-button";
import Ticker from "scripts/components/ticker";

import * as utils from "utils";
import { isNewDateTransaction, setupTransactionGroup } from "./utils";
import { ROUTES } from "defs";
import * as defs from "./defs";

import { ReactComponent as ChevronDownIcon } from "assets/icons/chevron-down.svg";
import styles from "./styles.module.css";

class TransactionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelecting: false,
      transactionGroup: {},
      selectedTransactionGroup: {},
    };
  }

  getNavItems = () => {
    const { isSelecting } = this.state;
    const navItems = [
      [
        {
          item: isSelecting ? "Cancel" : "Calculate",
          onClick: () => this.onSetIsSelecting(!isSelecting),
        },
        {
          item: "Back",
          onClick: this.props.goBack,
        },
      ],
    ];

    if (isSelecting) {
      navItems.push(this.getCalculateItem());
    }

    return navItems;
  };

  getCalculateItem = () => {
    const totalAmount = this.getTotalAmount();
    return [
      {
        item: "Total =",
        className: styles.total,
      },
      {
        item: (
          <Ticker
            amount={totalAmount}
            className={classNames(
              styles.total_amount,
              totalAmount > 0 && styles.positive,
              totalAmount === 0 && styles.neutral,
              totalAmount < 0 && styles.negative,
            )}
          />
        ),
      },
    ];
  };

  getTotalAmount = () => {
    let amount = 0;
    const { selectedTransactionGroup } = this.state;

    for (let year in selectedTransactionGroup) {
      for (let month in selectedTransactionGroup[year]) {
        for (let key in selectedTransactionGroup[year][month]) {
          if (key === "count" || !selectedTransactionGroup[year][month][key]) {
            continue;
          }
          amount += selectedTransactionGroup[year][month][key].amount;
        }
      }
    }
    return amount;
  };

  onSetIsSelecting = isSelecting => {
    let { transactionGroup, selectedTransactionGroup } = this.state;

    if (isSelecting) {
      transactionGroup = {};
      selectedTransactionGroup = {};

      setupTransactionGroup(
        this.props.transactions,
        transactionGroup,
        selectedTransactionGroup,
      );
    }

    this.setState({
      ...this.state,
      isSelecting,
      selectedTransactionGroup,
      transactionGroup,
    });
  };

  onSelectTransaction = transaction => {
    const date = moment(transaction.date);
    const year = date.year();
    const month = date.month();

    const { selectedTransactionGroup } = this.state;
    const exists = Boolean(
      selectedTransactionGroup[year][month][transaction.id],
    );

    selectedTransactionGroup[year].count += exists ? -1 : 1;
    selectedTransactionGroup[year][month].count += exists ? -1 : 1;
    selectedTransactionGroup[year][month][transaction.id] = exists
      ? null
      : transaction;

    this.setState({
      ...this.state,
      selectedTransactionGroup,
    });
  };

  onSelectYear = year => {
    const { selectedTransactionGroup, transactionGroup } = this.state;

    const groupYear = transactionGroup[year];

    if (selectedTransactionGroup[year].count === transactionGroup[year].count) {
      selectedTransactionGroup[year] = { count: 0 };

      for (let month in groupYear) {
        selectedTransactionGroup[year][month] = { count: 0 };
      }
    } else {
      for (let month in groupYear) {
        if (month === "count") {
          continue;
        }

        const groupMonth = groupYear[month];
        for (let key in groupMonth) {
          if (key === "count") {
            continue;
          }
          selectedTransactionGroup[year][month][key] = groupMonth[key];
        }
        selectedTransactionGroup[year][month].count = groupMonth.count;
      }
      selectedTransactionGroup[year].count = groupYear.count;
    }

    this.setState({ ...this.state, selectedTransactionGroup });
  };

  onSelectMonth = (year, month) => {
    const { selectedTransactionGroup, transactionGroup } = this.state;

    if (
      selectedTransactionGroup[year][month].count ===
      transactionGroup[year][month].count
    ) {
      selectedTransactionGroup[year].count -=
        selectedTransactionGroup[year][month].count;
      selectedTransactionGroup[year][month] = { count: 0 };
    } else {
      const groupMonth = transactionGroup[year][month];
      for (let key in groupMonth) {
        if (key === "count") {
          continue;
        }
        if (!selectedTransactionGroup[year][month][key]) {
          selectedTransactionGroup[year].count++;
        }
        selectedTransactionGroup[year][month][key] = groupMonth[key];
      }
      selectedTransactionGroup[year][month].count = groupMonth.count;
    }
    this.setState({ ...this.state, selectedTransactionGroup });
  };

  render() {
    const { history, transactions } = this.props;
    const {
      isSelecting,
      selectedTransactionGroup: selected,
      transactionGroup,
    } = this.state;

    return (
      <div className={styles.main}>
        <div className={styles.transactions}>
          {transactions.map((transaction, index) => {
            const dateDiff = isNewDateTransaction(transactions, index);
            const date = moment(transaction.date);
            const year = date.year();
            const month = date.month();

            selected[year] = selected[year] || {};
            selected[year][month] = selected[year][month] || {};
            transactionGroup[year] = transactionGroup[year] || {};
            transactionGroup[year][month] = transactionGroup[year][month] || {};

            const showYear =
              isSelecting &&
              selected[year].count === transactionGroup[year].count;
            const showMonth =
              isSelecting &&
              selected[year][month].count ===
                transactionGroup[year][month].count;
            const showDay =
              isSelecting && selected[year][month][transaction.id];

            return (
              <div className={styles.transaction} key={index}>
                {index !== 0 && dateDiff === defs.DATE_DIFF_ALL && (
                  <hr className={styles.hr} />
                )}
                {dateDiff === defs.DATE_DIFF_ALL && (
                  <ActionRow
                    alignLeft={true}
                    border={false}
                    className={classNames({
                      [styles.highlight]: true,
                      [styles.active]: showYear,
                    })}
                    container={false}
                    title={year}
                    titleClassName={styles.year}
                    leftItem={
                      <SelectButton
                        className={classNames(isSelecting && styles.select)}
                        active={showYear}
                        multiple={true}
                        show={isSelecting}
                        onClick={() => this.onSelectYear(year)}
                      />
                    }
                    rightItem={<ChevronDownIcon className="click" />}
                  />
                )}
                {dateDiff >= defs.DATE_DIFF_MONTH && (
                  <ActionRow
                    alignLeft={true}
                    border={false}
                    className={classNames({
                      [styles.highlight]: true,
                      [styles.active]: showMonth,
                    })}
                    container={false}
                    title={date.format("MMMM")}
                    titleClassName={styles.month}
                    leftItem={
                      <SelectButton
                        className={classNames(isSelecting && styles.select)}
                        active={showMonth}
                        multiple={true}
                        show={isSelecting}
                        onClick={() => this.onSelectMonth(year, month)}
                      />
                    }
                    rightItem={<ChevronDownIcon className="click" />}
                  />
                )}
                <ActionRow
                  alignLeft={true}
                  border={false}
                  className={classNames({
                    [styles.highlight]: true,
                    [styles.active]: showDay,
                  })}
                  container={false}
                  title={transaction.name}
                  titleClassName={styles.name}
                  leftItem={
                    <div className={styles.left_side}>
                      <SelectButton
                        className={classNames(isSelecting && styles.select)}
                        active={showDay}
                        multiple={true}
                        show={isSelecting}
                        onClick={() => this.onSelectTransaction(transaction)}
                      />
                      <div className={styles.date_wrapper}>
                        <p className={classNames(styles.day, styles.hidden)}>
                          22
                        </p>
                        <p
                          className={classNames(
                            styles.day,
                            styles.placeholder,
                            dateDiff === defs.DATE_DIFF_NONE && styles.hidden,
                          )}
                        >
                          {date.date()}
                        </p>
                      </div>
                    </div>
                  }
                  rightItem={
                    <p className={styles.amount}>
                      {utils.convertAmountToCurrency(transaction.amount)}
                    </p>
                  }
                  onMainClick={
                    !isSelecting &&
                    (() =>
                      history.push(
                        ROUTES.TRANSACTION_ITEM.replace(
                          ":transaction_id",
                          transaction.id,
                        ),
                      ))
                  }
                />
              </div>
            );
          })}
        </div>
        <Nav items={this.getNavItems()} />
      </div>
    );
  }
}

export default withRouter(TransactionList);
