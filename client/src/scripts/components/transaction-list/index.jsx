import React from "react";

import styles from "./styles.module.css";

class TransactionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelecting: false,
      selectedRange: [null, null],
      selectedTransactions: [],
    };
  }

  navItems = [];

  calculateItem = [];

  rangeItem = [];

  render() {
    const { header, transactions } = this.props;
    const { isSelecting, selectedRange, selectedTransactions } = this.state;

    return <div className={styles.main} />;
  }
}

export default TransactionList;
