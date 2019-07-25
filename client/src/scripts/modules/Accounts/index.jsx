import React from "react";
import { connect } from "react-redux";
import PlaidLink from "react-plaid-link";
import classNames from "classnames";
import { withLastLocation } from "react-router-last-location";

import AccountList from "./Account-List";
import Header from "scripts/components/header";
import Loading from "scripts/components/loading";
import IsLoading from "scripts/hoc/isLoading";
import Modal from "scripts/components/modal";
import Nav from "scripts/components/nav";

import * as utils from "utils";
import * as accountsActions from "scripts/modules/Accounts/actions";
import * as modalActions from "scripts/components/modal/actions";
import {
  PROP_ACCOUNTS,
  PROP_IS_EDITING,
  PROP_SELECTED_ACCOUNT,
  PROP_IS_DELETING_LINK,
} from "scripts/modules/Accounts/defs";
import { PROP_USER } from "scripts/modules/App/defs";
import { MODAL_NAMES, PLAID_OPTIONS, ROUTES } from "defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import { ReactComponent as CloseIcon } from "assets/icons/x.svg";
import modalStyles from "scripts/components/modal/styles.module.css";
import styles from "./styles.module.css";

const Accounts = ({
  accounts,
  history,
  lastLocation,
  isEditing,
  isDeletingLink,
  onOpenModal,
  onCloseModal,
  onDeleteInstitutionLink,
  onExchangePublicToken,
  onGetConnectedAccounts,
  onSetIsEditing,
  selectedAccount,
  user,
}) => {
  const goBack = () => {
    onSetIsEditing(false);
    utils.goBack(history, ROUTES.APP_DASHBOARD, lastLocation)();
  };

  const navItems = [
    [
      {
        item: isEditing ? "Cancel" : "Edit",
        onClick: () => onSetIsEditing(!isEditing),
      },
      {
        item: "Back",
        onClick: goBack,
      },
    ],
  ];

  if (isEditing) {
    navItems.push([
      {
        item: (
          <p
            className={classNames(
              styles.delete,
              selectedAccount.id && !isDeletingLink && styles.active,
              selectedAccount.id && "click-bg",
            )}
          >
            {isDeletingLink ? (
              <Loading size="small" />
            ) : selectedAccount.id ? (
              `Delete "${selectedAccount.institutionName}"`
            ) : (
              "Select institution"
            )}
          </p>
        ),
        disabled: !selectedAccount.id,
        onClick: selectedAccount.id
          ? () => onOpenModal(MODAL_NAMES.CONFIRM_LINK_DELETE)
          : () => {},
      },
    ]);
  }

  return (
    <IsLoading init={onGetConnectedAccounts}>
      <div className={styles.main}>
        <Header
          leftItem={
            <ArrowRightIcon
              className={classNames(styles.icon, "back-btn", "click")}
              onClick={goBack}
            />
          }
          title="Accounts"
          titleClassName={styles.title}
        />
        <AccountList />
        <PlaidLink
          className={classNames(
            styles.plaidBtn,
            accounts.length && styles.marginTop,
            "click",
          )}
          style={{}}
          onExit={() => {}}
          onLoad={utils.cleanupPlaidIframe}
          onSuccess={onExchangePublicToken}
          user={{
            legalName: user.name,
            emailAddress: user.email,
          }}
          {...PLAID_OPTIONS}
        >
          <div className={styles.plaidLink}>Link an account +</div>
        </PlaidLink>
        <Nav items={navItems} />
        <Modal modalName={MODAL_NAMES.CONFIRM_LINK_DELETE}>
          <Header
            rightItem={
              <CloseIcon
                className={"click"}
                onClick={() => onCloseModal(MODAL_NAMES.CONFIRM_LINK_DELETE)}
              />
            }
            title="Confirm deleting link"
            titleClassName={modalStyles.header}
          />
          <div className="container">
            <p className={modalStyles.p}>
              This action on <strong>{selectedAccount.institutionName}</strong>{" "}
              cannot be undone. This action will remove all associated data.
            </p>
            <div className={modalStyles.action_btns}>
              <button
                className={classNames(modalStyles.cancel, "click")}
                onClick={() => onCloseModal(MODAL_NAMES.CONFIRM_LINK_DELETE)}
              >
                Cancel
              </button>
              <button
                className={classNames(modalStyles.confirm, "red", "click")}
                onClick={() => {
                  onDeleteInstitutionLink();
                  onCloseModal(MODAL_NAMES.CONFIRM_LINK_DELETE);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </IsLoading>
  );
};

export const mapStateToProps = ({ app, accounts }) => ({
  isEditing: accounts.get(PROP_IS_EDITING),
  isDeletingLink: accounts.get(PROP_IS_DELETING_LINK),
  selectedAccount: accounts.get(PROP_SELECTED_ACCOUNT).toJS(),
  accounts: accounts.get(PROP_ACCOUNTS).toJS(),
  user: app.get(PROP_USER).toJS(),
});

export default connect(
  mapStateToProps,
  {
    onOpenModal: modalActions.openModal,
    onCloseModal: modalActions.closeModal,
    onDeleteInstitutionLink: accountsActions.deleteInstitutionLink,
    onExchangePublicToken: accountsActions.exchangePublicToken,
    onGetConnectedAccounts: accountsActions.getConnectedAccounts,
    onSetIsEditing: accountsActions.setIsEditing,
  },
)(withLastLocation(Accounts));
