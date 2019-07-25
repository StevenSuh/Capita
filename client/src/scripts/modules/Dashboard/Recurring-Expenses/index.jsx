import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { withRouter } from "react-router-dom";

import IsLoading from "scripts/hoc/isLoading";
import Empty from "scripts/components/empty";

import * as utils from "utils";

import * as transactionActions from "scripts/modules/Transactions/actions";
import { PROP_TRANSACTIONS } from "scripts/modules/Transactions/defs";
import { ROUTES } from "defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import styles from "./styles.module.css";

const RecurringExpenses = ({
  history,
  recurringExpenses,
  onGetTransactions,
}) => {
  return (
    <IsLoading init={onGetTransactions}>
      <div className={classNames(styles.main, "container")}>
        <div className={styles.titles}>
          <h4 className={styles.title}>Recurring expenses</h4>
          <div
            className={classNames(styles.side, "hover", "click")}
            onClick={() =>
              history.push(`${ROUTES.TRANSACTIONS}?recurring=true`)
            }
          >
            View all
          </div>
        </div>
        <div className={styles.items_wrapper}>
          <div className={styles.items}>
            {recurringExpenses.length ? (
              recurringExpenses.map(({ amount, date, id, name }, index) => (
                <div
                  className={styles.item}
                  key={index}
                  onClick={() =>
                    history.push(
                      ROUTES.TRANSACTION_ITEM.replace(":transaction_id", id),
                    )
                  }
                >
                  <div className={styles.date}>
                    {utils.formatShortDate(date)}
                  </div>
                  <div className={styles.name}>{name}</div>
                  <div className={styles.amount}>
                    {utils.convertAmountToCurrency(amount)}
                  </div>
                </div>
              ))
            ) : (
              <Empty message="No recurring expenses" />
            )}
            <div className={styles.placeholder} />
            {recurringExpenses.length === 10 && (
              <ArrowRightIcon
                className={classNames(styles.viewIcon, "hover", "click")}
                onClick={() =>
                  history.push(`${ROUTES.TRANSACTIONS}?recurring=true`)
                }
              />
            )}
          </div>
        </div>
      </div>
    </IsLoading>
  );
};

export const mapStateToProps = ({ transactions }) => ({
  recurringExpenses: transactions
    .get(PROP_TRANSACTIONS)
    .toJS()
    .filter(item => item.recurring)
    .slice(0, 10),
  // recurringExpenses: [
  //   {
  //     id: 1,
  //     userId: 1,
  //     accountId: 1,
  //     plaidTransactionId: "transaction-1",
  //     transactionType: "place",
  //     name: "Apple Store - Mac",
  //     amount: 1299.99,
  //     ISOCurrencyCode: "USD",
  //     unofficialCurrencyCode: null,
  //     date: "2019-07-22",
  //     pending: false,
  //     recurring: true,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: 1,
  //     userId: 1,
  //     accountId: 1,
  //     plaidTransactionId: "transaction-1",
  //     transactionType: "place",
  //     name: "Apple Store - Mac",
  //     amount: 1299.99,
  //     ISOCurrencyCode: "USD",
  //     unofficialCurrencyCode: null,
  //     date: "2019-07-22",
  //     pending: false,
  //     recurring: true,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: 1,
  //     userId: 1,
  //     accountId: 1,
  //     plaidTransactionId: "transaction-1",
  //     transactionType: "place",
  //     name: "Apple Store - Mac",
  //     amount: 1299.99,
  //     ISOCurrencyCode: "USD",
  //     unofficialCurrencyCode: null,
  //     date: "2019-07-22",
  //     pending: false,
  //     recurring: true,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: 1,
  //     userId: 1,
  //     accountId: 1,
  //     plaidTransactionId: "transaction-1",
  //     transactionType: "place",
  //     name: "Apple Store - Mac",
  //     amount: 1299.99,
  //     ISOCurrencyCode: "USD",
  //     unofficialCurrencyCode: null,
  //     date: "2019-07-22",
  //     pending: false,
  //     recurring: true,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   {
  //     id: 1,
  //     userId: 1,
  //     accountId: 1,
  //     plaidTransactionId: "transaction-1",
  //     transactionType: "place",
  //     name: "Apple Store - Mac",
  //     amount: 1299.99,
  //     ISOCurrencyCode: "USD",
  //     unofficialCurrencyCode: null,
  //     date: "2019-07-22",
  //     pending: false,
  //     recurring: true,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // ],
});

export default connect(
  mapStateToProps,
  {
    onGetTransactions: transactionActions.getTransactions,
  },
)(withRouter(RecurringExpenses));
