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
  PROP_LOGIN_ERROR,
  PROP_EMAIL,
  PROP_EMAIL_ERROR,
  PROP_PASSWORD,
  PROP_PASSWORD_ERROR,
  PROP_IS_ATTEMPTING_LOGIN,
} from "./defs";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import styles from "./styles.module.css";

const Login = props => {
  if (props.loggedIn) {
    return <Redirect to={ROUTES.APP_DASHBOARD} />;
  }

  const navItems = [
    [
      {
        item: "Forgot password",
        onClick: () => props.history.push(ROUTES.FORGOT_PASSWORD),
      },
      {
        item: props.isAttemptingLogin ? <Loading size="small" /> : "Submit",
        onClick: props.isAttemptingLogin ? null : props.onAttemptLogin,
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
          <h1 className={styles.title}>Log in to continue</h1>
          <div className={styles.item} />
        </div>
        {props.loginError && <p className={styles.error}>{props.loginError}</p>}
        <form
          noValidate
          onSubmit={e => {
            e.preventDefault();
            props.onAttemptLogin();
          }}
        >
          <Input
            className={styles.email_input}
            onChange={value => props.onChange(PROP_EMAIL, value)}
            error={props.emailError || Boolean(props.loginError)}
            name="email"
            type="email"
          />
          <Input
            onChange={value => props.onChange(PROP_PASSWORD, value)}
            error={props.passwordError || Boolean(props.loginError)}
            name="password"
            type="password"
          />
          <Input type="submit" />
        </form>
      </div>
      <Nav items={navItems} />
    </div>
  );
};

export const mapStateToProps = ({ app, login }) => ({
  loginError: login.get(PROP_LOGIN_ERROR),
  emailError: login.get(PROP_EMAIL_ERROR),
  passwordError: login.get(PROP_PASSWORD_ERROR),
  isAttemptingLogin: login.get(PROP_IS_ATTEMPTING_LOGIN),
  loggedIn: app.get(PROP_LOGGED_IN),
});

export default connect(
  mapStateToProps,
  {
    onAttemptLogin: actions.attemptLogin,
    onChange: actions.changeField,
  },
)(withLastLocation(Login));