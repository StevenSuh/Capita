// TODO
export const filterByIncome = transactions => {
  return transactions.reduce((curr, { amount }) => curr + amount, 0);
};

// TODO
export const filterBySpending = transactions => {
  return transactions.reduce((curr, { amount }) => curr + amount, 0) - 500;
};
