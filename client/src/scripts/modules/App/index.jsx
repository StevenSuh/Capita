import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import classNames from "classnames";

import Nav from "scripts/components/nav";
import Slideshow from "scripts/components/slideshow";

import styles from "./styles.module.css";

import { ROUTES } from "defs";
import { PROP_LOGGED_IN } from "./defs";

const App = ({ history, loggedIn }) => {
  if (loggedIn) {
    return <Redirect to={ROUTES.APP_DASHBOARD} />;
  }

  const navItems = [
    [
      {
        item: "Log in",
        onClick: () => history.push(ROUTES.LOGIN),
      },
      {
        item: "Get started",
        onClick: () => history.push(ROUTES.GET_STARTED),
      },
    ],
  ];

  return (
    <div>
      <Helmet>
        <title> Capita </title>
      </Helmet>
      <div className={styles.main}>
        <h1 className={styles.title}>CAPITA </h1>
        <Slideshow
          className={classNames(styles.slideshow, "container")}
          items={slideshowItems}
        />
      </div>
      <Nav items={navItems} />
    </div>
  );
};

const slideshowItems = [
  <div>
    <h6 className={styles.slideshow_item_title}>
      Minimalistic financial tracker
    </h6>
    <p className={styles.slideshow_item_content}>
      Focus on where your money is going
    </p>
  </div>,
  <div>
    <h6 className={styles.slideshow_item_title}>
      Centralize your financial life
    </h6>
    <p className={styles.slideshow_item_content}>
      Keep track of your bank accounts and transactions
    </p>
  </div>,
  <div>
    <h6 className={styles.slideshow_item_title}>
      Connect banks and transfer money
    </h6>
    <p className={styles.slideshow_item_content}>
      Connect up to 3 banks and easily transfer money between them
    </p>
  </div>,
  <div>
    <h6 className={styles.slideshow_item_title}>
      Understand how you spend your money
    </h6>
    <p className={styles.slideshow_item_content}>
      View your spending by month and customized categories
    </p>
  </div>,
];

export const mapStateToProps = ({ app }) => ({
  loggedIn: app.get(PROP_LOGGED_IN),
});

export default connect(mapStateToProps)(App);
