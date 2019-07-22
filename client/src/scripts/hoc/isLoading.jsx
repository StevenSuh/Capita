import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Loading from "scripts/components/loading";

import * as appActions from "scripts/modules/App/actions";
import { PROP_LOGGED_IN } from "scripts/modules/App/defs";

const IsLoadingWrapper = ({
  children,
  init,
  callback = () => {},
  loggedIn,
  onCheckLoggedIn,
}) => {
  if (!init) {
    init = onCheckLoggedIn;
  }

  const [isLoading, setIsLoading] = useState(!loggedIn);

  useEffect(() => {
    if (isLoading) {
      init().then(result => {
        callback(result);
        setIsLoading(false);
      });
    }
  }, [init, callback, isLoading]);

  return (
    <TransitionGroup className="transition-group">
      <CSSTransition
        appear
        classNames="reveal"
        key={`${isLoading}-isLoading`}
        timeout={{ enter: 200, exit: 0 }}
        unmountOnExit
      >
        {isLoading ? (
          <div style={{ width: "100%", height: "100%" }}>
            <div
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Loading size="large" />
            </div>
          </div>
        ) : (
          <div>{children}</div>
        )}
      </CSSTransition>
    </TransitionGroup>
  );
};

export const mapStateToProps = ({ app }) => ({
  loggedIn: app.get(PROP_LOGGED_IN),
});

export default connect(
  mapStateToProps,
  {
    onCheckLoggedIn: appActions.checkLoggedIn,
  },
)(IsLoadingWrapper);
