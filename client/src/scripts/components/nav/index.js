import React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

class Nav extends React.Component {
  componentDidMount() {
    const items = this.props.items;
    document.body.style.paddingBottom = `${items.length * 46}px`;
  }

  componentDidUpdate() {
    const items = this.props.items;
    document.body.style.paddingBottom = `${items.length * 46}px`;
  }

  componentWillUnmount() {
    document.body.style.paddingBottom = "";
  }

  render() {
    const props = this.props;
    return (
      <div className={classNames(styles.main, props.className)}>
        {props.items.reverse().map((row, index) => (
          <div className={styles.row} key={index}>
            {row.map(({ disabled, item, onClick }, index) => (
              <div
                className={classNames(
                  styles.item,
                  disabled && styles.disabled,
                  disabled && "disabled",
                  !disabled && "hover",
                  !disabled && "click-bg",
                )}
                onClick={onClick}
                key={index}
                type="button"
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Nav;
