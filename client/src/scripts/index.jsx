import React from "react";
import { Provider } from "react-redux";
import { Router, Redirect, Route, Switch } from "react-router-dom";
import { LastLocationProvider } from "react-router-last-location";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import store from "scripts/config/setup";
import history from "scripts/config/history";

import IsLoading from "scripts/hoc/isLoading";

import Accounts from "scripts/modules/Accounts";
import AccountItem from "scripts/modules/Account-Item";
import App from "scripts/modules/App";
import AppNotifications from "scripts/modules/Notifications/App";
import Dashboard from "scripts/modules/Dashboard";
import LandingPage from "scripts/modules/Landing";
import Login from "scripts/modules/Login";
import GetStarted from "scripts/modules/Get-Started";
import Snackbar from "scripts/components/snackbar";
import Spending from "scripts/modules/Spending";
import Support from "scripts/modules/Support";
import Transactions from "scripts/modules/Transactions";
import TransactionItem from "scripts/modules/Transaction-Item";
import Transfer from "scripts/modules/Transfer";
import UserInformation from "scripts/modules/Information/User";

import { ROUTES } from "defs";

const Wrapper = () => (
  <Provider store={store}>
    <Router history={history} basename={process.env.PUBLIC_URL}>
      <LastLocationProvider>
        <Route
          render={({ location }) => (
            <TransitionGroup className="transition-group">
              <CSSTransition
                appear
                classNames="reveal"
                key={`${location.key}-main`}
                timeout={{ enter: 200, exit: 0 }}
                unmountOnExit
              >
                <Switch>
                  <Route exact path={ROUTES.LANDING} component={LandingPage} />
                  <Route path={ROUTES.APP}>
                    <IsLoading>
                      <Switch>
                        <Route exact path={ROUTES.APP} component={App} />
                        <Route
                          exact
                          path={ROUTES.APP_DASHBOARD}
                          component={Dashboard}
                        />
                        <Route exact path={ROUTES.LOGIN} component={Login} />
                        <Route
                          exact
                          path={ROUTES.GET_STARTED}
                          component={GetStarted}
                        />
                        <Route
                          exact
                          path={ROUTES.ACCOUNTS}
                          component={Accounts}
                        />
                        <Route
                          path={ROUTES.ACCOUNT_ITEM}
                          component={AccountItem}
                        />
                        <Route
                          exact
                          path={ROUTES.TRANSFER}
                          component={Transfer}
                        />
                        <Route
                          exact
                          path={ROUTES.TRANSACTIONS}
                          component={Transactions}
                        />
                        <Route
                          path={ROUTES.TRANSACTION_ITEM}
                          component={TransactionItem}
                        />
                        <Route
                          exact
                          path={ROUTES.SPENDING}
                          component={Spending}
                        />
                        <Route
                          exact
                          path={ROUTES.APP_NOTIFICATIONS}
                          component={AppNotifications}
                        />
                        <Route
                          exact
                          path={ROUTES.USER_INFORMATION}
                          component={UserInformation}
                        />
                        <Route
                          exact
                          path={ROUTES.SUPPORT}
                          component={Support}
                        />
                        <Redirect to={ROUTES.APP_DASHBOARD} />
                      </Switch>
                    </IsLoading>
                  </Route>
                  <Redirect to={ROUTES.LANDING} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </LastLocationProvider>
    </Router>
    <Snackbar />
  </Provider>
);

export default Wrapper;
