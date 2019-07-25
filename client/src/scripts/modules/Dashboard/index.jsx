import React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";
import classNames from "classnames";

import Header from "scripts/components/header";
import ActionTabs from "./ActionTabs";
import ConnectedAccounts from "./Connected-Accounts";
import Modal from "scripts/components/modal";
import RecurringExpenses from "./Recurring-Expenses";

import * as modalActions from "scripts/components/modal/actions";
import { MODAL_NAMES, ROUTES } from "defs";
import { PROP_LOGGED_IN } from "scripts/modules/App/defs";

import { ReactComponent as MoreIcon } from "assets/icons/more-horizontal.svg";
import styles from "./styles.module.css";

const Dashboard = ({ loggedIn, history, onOpenModal, onCloseModal }) => {
  if (!loggedIn) {
    return <Redirect to={ROUTES.APP} />;
  }

  return (
    <div>
      <Helmet>
        <title>Capita - Dashboard</title>
      </Helmet>

      <Header
        rightItem={
          <MoreIcon
            className={classNames(styles.icon, "click")}
            onClick={() => onOpenModal(MODAL_NAMES.OPTIONS)}
          />
        }
        title="CAPITA"
      />

      <div className={styles.content}>
        <ConnectedAccounts />
        <div className="hr" />
        <RecurringExpenses />
        <ActionTabs />
      </div>

      <Modal bottom={true} modalName={MODAL_NAMES.OPTIONS}>
        <div
          className={classNames(styles.option_row, "click-bg")}
          onClick={() => {
            onCloseModal(MODAL_NAMES.OPTIONS);
            history.push(ROUTES.APP_NOTIFICATIONS);
          }}
        >
          Edit notifications
        </div>
        <div
          className={classNames(styles.option_row, "click-bg")}
          onClick={() => {
            onCloseModal(MODAL_NAMES.OPTIONS);
            history.push(ROUTES.USER_INFORMATION);
          }}
        >
          Edit user information
        </div>
        <div
          className={classNames(styles.option_row, "click-bg")}
          onClick={() => {
            onCloseModal(MODAL_NAMES.OPTIONS);
            history.push(ROUTES.SUPPORT);
          }}
        >
          Help/Contact
        </div>
        <div
          className={classNames(styles.option_row, "red", "click-bg")}
          onClick={() => {
            onCloseModal(MODAL_NAMES.OPTIONS);
            onOpenModal(MODAL_NAMES.CONFIRM_CAPITA_ACCOUNT_DELETE);
          }}
        >
          Delete Capita account
        </div>
      </Modal>
    </div>
  );
};

export const mapStateToProps = ({ app }) => ({
  loggedIn: app.get(PROP_LOGGED_IN),
});

export default connect(
  mapStateToProps,
  {
    onOpenModal: modalActions.openModal,
    onCloseModal: modalActions.closeModal,
  },
)(Dashboard);
