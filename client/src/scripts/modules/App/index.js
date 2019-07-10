import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';

import IsLoading from 'src/scripts/hoc/isLoading';
import Nav from 'src/scripts/components/nav';
import Slideshow from 'src/scripts/components/slideshow';

import styles from './styles.module.css';

import * as actions from './actions';
import { ROUTES } from 'src/defs';
import { PROP_LOGGED_IN } from './defs';

const App = ({ history, loggedIn, onCheckLoggedIn }) => {
  if (loggedIn) {
    return <Redirect to={ROUTES.APP_DASHBOARD} />;
  }

  const navItems = [[
    {
      item: 'Log in',
      onClick: () => history.push(ROUTES.LOGIN),
    },
    {
      item: 'Get started',
      onClick: () => history.push(ROUTES.GET_STARTED),
    },
  ]];

  return (
    <IsLoading init={onCheckLoggedIn} callback={() => {}}>
      <div>
        <Helmet>
          <title>Capita - App</title>
        </Helmet>

        <div className={styles.main}>
          <h1 className={styles.title}>
            CAPITA
          </h1>
          <Slideshow
            className={classNames(styles.slideshow, 'container')}
            items={slideshowItems}
          />
        </div>
        <Nav items={navItems} />
      </div>
    </IsLoading>
  );
};

const slideshowItems = [
  (
    <div>
      <h6 className={styles.slideshow_item_title}>
        Centralize your financial life
      </h6>
      <p className={styles.slideshow_item_content}>
        Keep track of your accounts from a single app
      </p>
    </div>
  ),
  (
    <div>
      <h6 className={styles.slideshow_item_title}>
        Connect accounts and transfer money
      </h6>
      <p className={styles.slideshow_item_content}>
        Connect up to 5 accounts and easily transfer money between them
      </p>
    </div>
  ),
  (
    <div>
      <h6 className={styles.slideshow_item_title}>
        Understand how you spend your money
      </h6>
      <p className={styles.slideshow_item_content}>
        View your spending by month or categories
      </p>
    </div>
  ),
];

export const mapStateToProps = ({ app }) => ({
  loggedIn: app.get(PROP_LOGGED_IN),
});

export default connect(
  mapStateToProps,
  { onCheckLoggedIn: actions.checkLoggedIn },
)(App);
