import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { withRouter } from "react-router-dom";

import IsLoading from "scripts/hoc/isLoading";
import Empty from "scripts/components/empty";

import * as utils from "utils";

import * as transactionActions from "scripts/modules/Transactions/actions";
import { PROP_RECURRING_TRANSACTIONS } from "scripts/modules/Transactions/defs";
import { ROUTES } from "defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import styles from "./styles.module.css";

const RecurringExpenses = ({
  history,
  recurringExpenses,
  onGetRecurringTransactions,
}) => {
  return (
    <IsLoading className={styles.isLoading} init={onGetRecurringTransactions}>
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
    .get(PROP_RECURRING_TRANSACTIONS)
    .toJS()
    .slice(0, 10),
});

export default connect(
  mapStateToProps,
  {
    onGetRecurringTransactions: transactionActions.getRecurringTransactions,
  },
)(withRouter(RecurringExpenses));
