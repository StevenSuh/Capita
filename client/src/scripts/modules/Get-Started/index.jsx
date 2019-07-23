import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import classNames from "classnames";
import { withLastLocation } from "react-router-last-location";

import Input from "scripts/components/input";
import Loading from "scripts/components/loading";
import Nav from "scripts/components/nav";

import * as actions from "./actions";
import * as utils from "utils";

import { ROUTES } from "defs";
import { PROP_LOGGED_IN } from "scripts/modules/App/defs";
import {
  PROP_NAME,
  PROP_NAME_ERROR,
  PROP_EMAIL,
  PROP_EMAIL_ERROR,
  PROP_PASSWORD,
  PROP_PASSWORD_ERROR,
  PROP_CONFIRM_PASSWORD,
  PROP_CONFIRM_PASSWORD_ERROR,
  PROP_IS_ATTEMPTING_REGISTER,
} from "./defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import styles from "./styles.module.css";

const GetStarted = props => {
  if (props.loggedIn) {
    return <Redirect to={ROUTES.APP_DASHBOARD} />;
  }

  const navItems = [
    [
      {
        item: props.isAttemptingRegister ? <Loading size="small" /> : "Submit",
        onClick: props.isAttemptingRegister ? null : props.onAttemptRegister,
      },
    ],
  ];

  return (
    <div className={styles.main}>
      <div className="container tight">
        <div className={styles.header}>
          <ArrowRightIcon
            className={classNames(styles.icon, "back-btn", "hover", "click")}
            onClick={utils.goBack(
              props.history,
              ROUTES.APP,
              props.lastLocation,
            )}
          />
          <h1 className={styles.title}>Enter your information</h1>
          <div className={styles.item} />
        </div>
        <form
          noValidate
          onSubmit={e => {
            e.preventDefault();
            props.onAttemptRegister();
          }}
        >
          <Input
            className={styles.input}
            onChange={value => props.onChange(PROP_NAME, value)}
            error={props.nameError}
            name="full name"
            type="text"
          />
          <Input
            className={styles.input}
            onChange={value => props.onChange(PROP_EMAIL, value)}
            error={props.emailError}
            name="email"
            type="email"
          />
          <Input
            className={styles.input}
            onChange={value => props.onChange(PROP_PASSWORD, value)}
            error={props.passwordError}
            name="password"
            type="password"
          />
          <Input
            onChange={value => props.onChange(PROP_CONFIRM_PASSWORD, value)}
            error={props.confirmPasswordError}
            name="confirm password"
            type="password"
          />
          <Input type="submit" />
        </form>
      </div>
      <Nav items={navItems} />
    </div>
  );
};

export const mapStateToProps = ({ app, getStarted }) => ({
  nameError: getStarted.get(PROP_NAME_ERROR),
  emailError: getStarted.get(PROP_EMAIL_ERROR),
  passwordError: getStarted.get(PROP_PASSWORD_ERROR),
  confirmPasswordError: getStarted.get(PROP_CONFIRM_PASSWORD_ERROR),
  isAttemptingRegister: getStarted.get(PROP_IS_ATTEMPTING_REGISTER),
  loggedIn: app.get(PROP_LOGGED_IN),
});

export default connect(
  mapStateToProps,
  {
    onAttemptRegister: actions.attemptRegister,
    onChange: actions.changeField,
  },
)(withLastLocation(GetStarted));
