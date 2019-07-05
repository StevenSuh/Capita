import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Loading from 'src/scripts/components/loading';
import Nav from 'src/scripts/components/nav';

import styles from './styles.module.css';

import * as actions from './actions';
import { ROUTES } from 'src/defs';
import { PROP_LOGGED_IN } from './defs';

const App = props => {
  useEffect(actions.checkLoggedIn, []);

  if (props.loggedIn) {
    return <Redirect to={ROUTES.APP_DASHBOARD} />;
  }

  const navItems = [[
    {
      text: 'Log in',
      onClick: () => props.history.push(ROUTES.LOGIN),
    },
    {
      text: 'Get started',
      onClick: () => props.history.push(ROUTES.GET_STARTED),
    },
  ]];

  return (
    <div className={styles.main}>
      <Helmet>
        <title>Capita - App</title>
      </Helmet>

      <Loading />

      <Nav items={navItems} />
    </div>
  );
};

export const mapStateToProps = ({ app }) => ({
  loggedIn: app[PROP_LOGGED_IN],
});

export default connect(
  mapStateToProps,
  {
    onSetLoggedIn: actions.setLoggedIn,
  },
)(App);
