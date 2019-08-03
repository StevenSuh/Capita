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
  const firstDay = `${year}-${formattedMonth}-00`;
  const formattedDays = [firstDay];

  for (let i = 0; i < totalDays; i++) {
    const formattedDay = `0${i + 1}`.slice(-2);
    formattedDays.push(`${year}-${formattedMonth}-${formattedDay}`);
  }

  return formattedDays;
};

export const filterTransactions = (transactions, year, month, days) => {
  const filtered = transactions.filter(({ date }) => {
    const curr = moment(date);
    return curr.year() === year && curr.month() === month;
  });

  let amount = 0;
  let index = 0;
  const amounts = [];
  const monthTransactions = [];
  const adjustedDays = [];

  days.forEach(day => {
    let itemFound = false;

    while (index < filtered.length && filtered[index].date === day) {
      monthTransactions.push(filtered[index]);
      amount += filtered[index++].amount;

      adjustedDays.push(day);
      amounts.push(amount);
      itemFound = true;
    }

    if (!itemFound) {
      adjustedDays.push(day);
      amounts.push(amount);
    }
  });

  console.log(amounts, adjustedDays);

  return [monthTransactions, amounts, adjustedDays];
};
