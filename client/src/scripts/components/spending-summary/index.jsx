import React from "react";
import classNames from "classnames";

import ActionRow from "scripts/components/action-row";

import * as utils from "utils";
import { filterByIncome, filterBySpending } from "./utils";

import styles from "./styles.module.css";

const SpendingSummary = ({ transactions }) => {
  const income = filterByIncome(transactions);
  const spending = filterBySpending(transactions);
  const overall = income + spending;

  return (
    <div className={styles.summary}>
      <ActionRow
        alignLeft={true}
        border={false}
        container={false}
        title="Income"
        titleClassName={styles.summary_title}
        rightItem={
          <p className={styles.summary_item}>
            {utils.convertAmountToCurrency(income)}
          </p>
        }
      />
      <ActionRow
        alignLeft={true}
        border={false}
        container={false}
        title="Spending"
        titleClassName={styles.summary_title}
        rightItem={
          <p className={styles.summary_item}>
            {utils.convertAmountToCurrency(spending)}
          </p>
        }
      />
      <hr className={styles.summary_hr} />
      <ActionRow
        alignLeft={true}
        border={false}
        container={false}
        title="Overall"
        titleClassName={styles.summary_title}
        rightItem={
          <p
            className={classNames(
              styles.summary_item,
              overall < 0 && styles.negative,
              overall > 0 && styles.positive,
            )}
          >
            {overall > 0 && "+"}
            {utils.convertAmountToCurrency(overall)}
          </p>
        }
      />
    </div>
  );
};

export default SpendingSummary;
