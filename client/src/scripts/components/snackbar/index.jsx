import React from "react";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import classNames from "classnames";

import * as actions from "./actions";

// import { ReactComponent as CloseIcon } from 'assets/icons/x.svg';
import { PROP_SNACKBARS } from "./defs";
import styles from "./styles.module.css";

const Snackbar = props => (
  <TransitionGroup className={classNames(styles.main, "transition-group")}>
    {props.snackbars.reverse().map(({ id, message, type }) => (
      <CSSTransition
        key={id}
        classNames="snackbar"
        timeout={{ enter: 100, exit: 200 }}
        unmountOnExit
      >
        <div className={classNames(styles.item, styles[type])}>
          <div className={styles.message}>{message}</div>
          {/* <CloseIcon
            className={classNames(styles.icon, 'click')}
            onClick={() => props.onRemoveSnackbar(id)}
          /> */}
        </div>
      </CSSTransition>
    ))}
  </TransitionGroup>
);

export const mapStateToProps = ({ snackbar }) => {
  return {
    snackbars: snackbar.get(PROP_SNACKBARS).toJS(),
  };
};

export default connect(
  mapStateToProps,
  { onRemoveSnackbar: actions.removeSnackbar },
)(Snackbar);
