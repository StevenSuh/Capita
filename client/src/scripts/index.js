import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import store from 'src/scripts/config/setup';

import App from 'src/scripts/modules/App';
import Dashboard from 'src/scripts/modules/Dashboard';
import LandingPage from 'src/scripts/modules/Landing';
import Login from 'src/scripts/modules/Login';
import SignUp from 'src/scripts/modules/SignUp';

import { ROUTES } from 'src/defs';

const Wrapper = () =>
  (
    <Provider store={store}>
      <Router basename={process.env.PUBLIC_URL}>
        <Route render={({ location }) => (
          <TransitionGroup className="transition-group">
            <CSSTransition
              appear
              classNames="reveal"
              key={`${location.key}-main`}
              timeout={{ enter: 200, exit: 0 }}
              unmountOnExit
            >
              <Switch>
                <Route exact path={ROUTES.APP} component={App} />
                <Route exact path={ROUTES.APP_DASHBOARD} component={Dashboard} />
                <Route exact path={ROUTES.LOGIN} component={Login} />
                <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Redirect to={ROUTES.LANDING} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )} />
      </Router>
    </Provider>
  );

export default Wrapper;