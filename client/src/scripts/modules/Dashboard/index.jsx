import React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";

import Header from "scripts/components/header";
import ActionTabs from "./ActionTabs";
import ConnectedAccounts from "./ConnectedAccounts";
import RecurringExpenses from "./RecurringExpenses";

import { ROUTES } from "defs";
import { PROP_LOGGED_IN } from "scripts/modules/App/defs";

import styles from "./styles.module.css";

const Dashboard = ({ loggedIn }) => {
  if (!loggedIn) {
    return <Redirect to={ROUTES.APP} />;
  }

  return (
    <div>
      <Helmet>
        <title>Capita - Dashboard</title>
      </Helmet>

      <Header title="CAPITA" />

      <div className={styles.content}>
        <ConnectedAccounts />
        <div className="hr" />
        <RecurringExpenses />
        <ActionTabs />
      </div>
    </div>
  );
};

export const mapStateToProps = ({ app }) => ({
  loggedIn: app.get(PROP_LOGGED_IN),
});

export default connect(
  mapStateToProps,
  // {
  //   onCheckLoggedIn: actions.checkLoggedIn,
  //   onCheckLoggedInCallback: actions.checkLoggedInCallback,
  // },
)(Dashboard);
