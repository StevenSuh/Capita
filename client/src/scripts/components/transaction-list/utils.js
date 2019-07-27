import moment from "moment";
import * as defs from "./defs";

export const isNewDateTransaction = (transactions, index) => {
  if (index < 1) {
    return defs.DATE_DIFF_ALL;
  }

  const curr = moment(transactions[index].date);
  const prev = transactions[index - 1];

  if (curr.isBefore(prev.date, "year")) {
    return defs.DATE_DIFF_ALL;
  }

  if (curr.isBefore(prev.date, "month")) {
    return defs.DATE_DIFF_MONTH;
  }

  if (curr.isBefore(prev.date, "day")) {
    return defs.DATE_DIFF_DAY;
  }

  return defs.DATE_DIFF_NONE;
};

export const setupTransactionGroup = (transactions, group, selectedGroup) =>
  transactions.forEach(transaction => {
    const curr = moment(transaction.date);
    const year = curr.year();
    const month = curr.month();

    if (!group[year]) {
      group[year] = { count: 0 };
      selectedGroup[year] = { count: 0 };
    }

    if (!group[year][month]) {
      group[year][month] = { count: 0 };
      selectedGroup[year][month] = { count: 0 };
    }

    group[year].count++;
    group[year][month].count++;
    group[year][month][transaction.id] = transaction;
  });
