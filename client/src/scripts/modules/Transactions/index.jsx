import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { withLastLocation } from "react-router-last-location";
import queryString from "query-string";

import Filter from "./filter";
import Header from "scripts/components/header";
import IsLoading from "scripts/hoc/isLoading";
import Modal from "scripts/components/modal";
import TransactionList from "./transaction-list";

import * as utils from "utils";
import { ROUTES, MODAL_NAMES } from "defs";
import * as modalActions from "scripts/components/modal/actions";
import * as actions from "./actions";
import { PROP_TRANSACTIONS } from "./defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import { ReactComponent as MoreIcon } from "assets/icons/more-horizontal.svg";
import styles from "./styles.module.css";

const Transactions = ({
  history,
  lastLocation,
  location: { search, pathname },
  onGetTransactions,
  onCloseModal,
  onOpenModal,
  transactions,
}) => {
  const params = queryString.parse(search, { arrayFormat: "comma" });

  const filter = params.filter === "true";
  const recurring = params.recurring === "true";
  const { accountId, query } = params;

  let initFn = onGetTransactions;

  if (recurring) {
    initFn = () => onGetTransactions(false, { recurring });
  }
  if (accountId) {
    initFn = () => onGetTransactions(false, { accountId });
  }
  if (query) {
    initFn = () => onGetTransactions(false, { query });
  }

  return (
    <div>
      <Header
        title="Transactions"
        titleClassName={styles.title}
        leftItem={
          <ArrowRightIcon
            className={classNames(styles.icon, "back-btn", "click")}
            onClick={utils.goBack(history, ROUTES.APP_DASHBOARD, lastLocation)}
          />
        }
        rightItem={
          <MoreIcon
            className="click"
            onClick={() => onOpenModal(MODAL_NAMES.TRANSACTIONS_OPTIONS)}
          />
        }
      />
      <IsLoading className={styles.isLoading} init={initFn}>
        <div className={styles.main}>
          <div className={classNames(styles.content, "container")}>
            <TransactionList
              goBack={utils.goBack(history, ROUTES.APP_DASHBOARD, lastLocation)}
              transactions={transactions}
            />
          </div>
        </div>
      </IsLoading>
      <Modal bottom={true} modalName={MODAL_NAMES.TRANSACTIONS_OPTIONS}>
        <div
          className={classNames(styles.option_row, "click-bg")}
          onClick={() => {
            onCloseModal(MODAL_NAMES.TRANSACTIONS_OPTIONS);
            history.push(
              `${pathname}?${queryString.stringify({
                ...params,
                search: true,
              })}`,
            );
          }}
        >
          Search
        </div>
        <div
          className={classNames(styles.option_row, "click-bg")}
          onClick={() => {
            onCloseModal(MODAL_NAMES.TRANSACTIONS_OPTIONS);
            history.push(
              `${pathname}?${queryString.stringify({
                ...params,
                filter: true,
              })}`,
            );
          }}
        >
          Filter
        </div>
        <div
          className={classNames(styles.option_row, styles.action, "click-bg")}
          onClick={() => {
            onCloseModal(MODAL_NAMES.TRANSACTIONS_OPTIONS);
            history.push(ROUTES.NEW_TRANSACTION);
          }}
        >
          Add new transaction
        </div>
      </Modal>
      <Modal
        full={true}
        open={filter}
        modalName={MODAL_NAMES.TRANSACTIONS_FILTER}
      >
        <Filter />
      </Modal>
    </div>
  );
};

export const mapStateToProps = ({ transactions }) => ({
  transactions: transactions.get(PROP_TRANSACTIONS).toJS(),
});

export default connect(
  mapStateToProps,
  {
    onGetTransactions: actions.getTransactions,
    onOpenModal: modalActions.openModal,
    onCloseModal: modalActions.closeModal,
  },
)(withLastLocation(Transactions));
