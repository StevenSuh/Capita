import React from "react";
import { withRouter } from "react-router-dom";

import ActionRow from "scripts/components/action-row";

import styles from "./styles.module.css";

const ActionTabs = ({ history }) => {
  return (
    <div className={styles.main}>
      <ActionRow
        title="Accounts"
        subtitle="Add or delete your connected bank accounts"
        onMainClick={() => history.push("/app/accounts")}
      />
      <ActionRow
        title="Transfer"
        subtitle="Move money between your accounts"
        onMainClick={() => history.push("/app/transfer")}
      />
      <ActionRow
        title="Transactions"
        subtitle="View all of your transactions"
        onMainClick={() => history.push("/app/transactions")}
      />
      <ActionRow
        title="Spending"
        subtitle="Understand your expenses"
        onMainClick={() => history.push("/app/spending")}
      />
    </div>
  );
};

export default withRouter(ActionTabs);
