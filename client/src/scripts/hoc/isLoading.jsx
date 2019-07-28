import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Loading from "scripts/components/loading";

import * as appActions from "scripts/modules/App/actions";

const IsLoadingWrapper = ({
  className,
  children,
  init,
  callback = () => {},
  onCheckLoggedIn,
  onRedirectByStatus,
}) => {
  if (!init) {
    init = onCheckLoggedIn;
    callback = onRedirectByStatus;
  }

  const [isLoading, setIsLoading] = useState(true);

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
          <div
            className={className}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Loading size="large" />
          </div>
        ) : (
          <div>{children}</div>
        )}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default connect(
  null,
  {
    onCheckLoggedIn: appActions.checkLoggedIn,
    onRedirectByStatus: appActions.redirectByStatus,
  },
)(IsLoadingWrapper);
