import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import Loading from "scripts/components/loading";

import * as appActions from "scripts/modules/App/actions";

class IsLoadingWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: true };
  }

  componentDidMount() {
    let {
      init,
      callback = () => {},
      onCheckLoggedIn,
      onRedirectByStatus,
    } = this.props;
    const { isLoading } = this.state;

    if (!init) {
      init = onCheckLoggedIn;
      callback = onRedirectByStatus;
    }

    if (isLoading) {
      init().then(result => {
        callback(result);
        this.setState({ isLoading: false });
      });
    }
  }

  render() {
    const { className, children } = this.props;
    const { isLoading } = this.state;

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          className={classNames({
            hidden: isLoading,
          })}
        >
          {children}
        </div>
        <div
          className={classNames({
            [className]: true,
            hidden: !isLoading,
          })}
          style={{
            width: "100%",
            height: "100%",
            display: isLoading ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Loading size="large" />
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  {
    onCheckLoggedIn: appActions.checkLoggedIn,
    onRedirectByStatus: appActions.redirectByStatus,
  },
)(IsLoadingWrapper);
