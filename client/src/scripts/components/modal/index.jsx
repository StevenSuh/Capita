import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import { PROP_MODALS } from "./defs";
import * as actions from "./actions";

import styles from "./styles.module.css";

const Modal = ({
  bottom = false,
  top = false,
  full = false,
  open: propsOpen = false,
  className,
  children,
  modalName,
  modals,
  onCloseModal,
}) => {
  const open = modals[modalName] || propsOpen;

  return (
    <div className={classNames(styles.main, open && styles.open)}>
      <div
        className={classNames(
          styles.bg,
          full && styles.full,
          open && styles.open,
        )}
        onClick={open ? () => onCloseModal(modalName) : () => {}}
      />
      <div
        className={classNames(
          styles.content,
          bottom && styles.bottom,
          top && styles.top,
          full && styles.full,
          open && styles.open,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const mapStateToProps = ({ modal }) => ({
  modals: modal.get(PROP_MODALS).toJS(),
});

export default connect(
  mapStateToProps,
  { onCloseModal: actions.closeModal },
)(Modal);
