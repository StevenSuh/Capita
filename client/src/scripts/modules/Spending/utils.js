import moment from "moment";

export const getDaysInMonth = (year, month) => {
  const now = moment();
  const date = moment();
  date.year(year);
  date.month(month);

  let totalDays = date.daysInMonth();
  if (now.isSame(date, "month")) {
    totalDays = now.date();
  }

  const formattedMonth = `0${date.month() + 1}`.slice(-2);
  const formattedDays = [];
  for (let i = 0; i < totalDays; i++) {
    formattedDays.push(`${year}-${formattedMonth}-${i}`);
  }

  return formattedDays;
};

export const normalizeTransactions = (transactions, year, month, days) => {
  const filtered = transactions.filter(({ date }) => {
    const curr = moment(date);
    return curr.year() === year && curr.month() === month;
  });

  let amount = 0;
  let index = 0;
  const normalized = [];

  days.forEach(day => {
    if (index < filtered.length && filtered[index].date === day) {
      amount += filtered[index].amount;
      index++;
    }
    normalized.push(amount);
  });

  return normalized;
};
