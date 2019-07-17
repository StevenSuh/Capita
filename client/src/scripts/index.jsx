import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import store from "scripts/config/setup";
import history from "scripts/config/history";

import IsLoading from "scripts/hoc/isLoading";

import App from "scripts/modules/App";
import Dashboard from "scripts/modules/Dashboard";
import LandingPage from "scripts/modules/Landing";
import Login from "scripts/modules/Login";
import GetStarted from "scripts/modules/Get-Started";
import Snackbar from "scripts/components/snackbar";

import { ROUTES } from "defs";

const Wrapper = () => (
  <Provider store={store}>
    <Router history={history} basename={process.env.PUBLIC_URL}>
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
                <Route
                  path={ROUTES.APP}
                  render={() => (
                    // check if logged in
                    <IsLoading>
                      <div>
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
                      </div>
                    </IsLoading>
                  )}
                />
                <Redirect to={ROUTES.LANDING} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
    </Router>
    <Snackbar />
  </Provider>
);

export default Wrapper;
