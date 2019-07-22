import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import IsLoading from "scripts/hoc/isLoading";
import Empty from "scripts/components/empty";

import * as transactionActions from "scripts/modules/Transactions/actions";
import { PROP_RECURRING_EXPENSES } from "scripts/modules/Transactions/defs";
import styles from "./styles.module.css";

const RecurringExpenses = ({ recurringExpenses, onGetRecurringExpenses }) => {
  return (
    <IsLoading init={onGetRecurringExpenses}>
      <div className={classNames(styles.main, "container")}>
        <h4 className={styles.title}>Recurring expenses</h4>
        {recurringExpenses.length ? (
          recurringExpenses.map((expense, index) => (
            <div key={index}>
              {expense}
              {expense}
            </div>
          ))
        ) : (
          <Empty message="No recurring expenses" />
        )}
      </div>
    </IsLoading>
  );
};

export const mapStateToProps = ({ transactions }) => ({
  recurringExpenses: transactions.get(PROP_RECURRING_EXPENSES).toJS(),
});

export default connect(
  mapStateToProps,
  {
    onGetRecurringExpenses: transactionActions.getRecurringExpenses,
  },
)(RecurringExpenses);
