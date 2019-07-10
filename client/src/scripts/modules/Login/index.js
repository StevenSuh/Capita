import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Input from 'src/scripts/components/input';
import Loading from 'src/scripts/components/loading';
import Nav from 'src/scripts/components/nav';

import * as actions from './actions';

import { ROUTES } from 'src/defs';
import { PROP_LOGGED_IN } from 'src/scripts/modules/App/defs';
import {
  PROP_EMAIL,
  PROP_EMAIL_ERROR,
  PROP_PASSWORD,
  PROP_PASSWORD_ERROR,
  PROP_IS_ATTEMPTING_LOGIN,
} from './defs';
import styles from './styles.module.css';

const Login = props => {
  if (props.loggedIn) {
    return <Redirect to={ROUTES.APP_DASHBOARD} />;
  }

  const navItems = [[
    {
      item: 'Forgot password',
      onClick: () => props.history.push(ROUTES.FORGOT_PASSWORD),
    },
    {
      item: props.isAttemptingLogin ? <Loading size="small" /> : 'Submit',
      onClick: props.onAttemptLogin,
    },
  ]];

  return (
    <div className={styles.main}>
      <div className="container tight">
        <h1 className={styles.title}>
          Enter your information
        </h1>
        <form noValidate onSubmit={e => {
          e.preventDefault();
          props.onAttemptLogin();
        }}>
          <Input
            className={styles.email_input}
            onChange={value => props.onChange(PROP_EMAIL, value)}
            error={props.emailError}
            name="email"
            type="email"
          />
          <Input
            onChange={value => props.onChange(PROP_PASSWORD, value)}
            error={props.passwordError}
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
)(Login);
