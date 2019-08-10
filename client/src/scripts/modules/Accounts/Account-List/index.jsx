import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Empty from "scripts/components/empty";
import SelectButton from "scripts/components/select-button";

import * as utils from "utils";
import { isNewInstitutionId } from "../utils";
import * as accountsActions from "scripts/modules/Accounts/actions";
import {
  PROP_ACCOUNTS,
  PROP_IS_EDITING,
  PROP_SELECTED_ACCOUNT,
} from "scripts/modules/Accounts/defs";
import { ROUTES } from "defs";

import ActionRow from "scripts/components/action-row";

import { ReactComponent as CardIcon } from "assets/icons/credit-card.svg";
import styles from "./styles.module.css";

const AccountList = ({
  accounts,
  history,
  isEditing,
  onSelectAccount,
  selectedAccount,
}) => {
  return (
    <div className={styles.accounts}>
      {accounts.length ? (
        accounts.map((account, index) => (
          <ActionRow
            alignLeft={true}
            border={false}
            className={classNames({
              [styles.highlight]: true,
              [styles.active]:
                selectedAccount.institutionLinkId === account.institutionLinkId,
            })}
            title={`${account.subtype} - ${account.mask}`}
            titleClassName={styles.account_title}
            // TODO edit subtitle and mainclick to fix link
            // subtitle={account.update ? "need fix link" : ""}
            key={index}
            leftItem={
              <div className={styles.left_side}>
                <SelectButton
                  className={classNames(isEditing && styles.select)}
                  active={selectedAccount.id === account.id}
                  show={isEditing && isNewInstitutionId(accounts, index)}
                  onClick={() => onSelectAccount(account)}
                />
                <img
                  src={account.institutionLogo}
                  className={styles.institution_logo}
                  alt="institution logo"
                />
              </div>
            }
            rightItem={
              <p className={styles.balance}>
                {utils.convertAmountToCurrency(
                  account.balanceAvailable || account.balanceCurrent,
                )}
              </p>
            }
            onMainClick={
              !isEditing &&
              (() =>
                history.push(
                  ROUTES.ACCOUNT_ITEM.replace(":account_id", account.id),
                ))
            }
          />
        ))
      ) : (
        <Empty
          icon={<CardIcon className={styles.icon} />}
          message="No accounts linked"
        />
      )}
    </div>
  );
};

export const mapStateToProps = ({ accounts }) => ({
  isEditing: accounts.get(PROP_IS_EDITING),
  selectedAccount: accounts.get(PROP_SELECTED_ACCOUNT).toJS(),
  accounts: accounts
    .get(PROP_ACCOUNTS)
    .toJS()
    .sort((a, b) => b.institutionLinkId - a.institutionLinkId),
});

export default connect(
  mapStateToProps,
  {
    onSelectAccount: accountsActions.selectAccount,
  },
)(withRouter(AccountList));
