import React from "react";
import classNames from "classnames";

import { ReactComponent as EyeIcon } from "assets/icons/eye.svg";
import { ReactComponent as EyeOffIcon } from "assets/icons/eye-off.svg";
import styles from "./styles.module.css";

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      value: "",
      ignorePassword: false,
    };
  }

  onInputChange = e => {
    const { onChange = () => {} } = this.props;
    const { value } = e.target;

    this.setState({ value });
    onChange(value);
  };

  onInputFocus = () => {
    this.setState({ focused: true });
  };

  onInputBlur = () => {
    this.setState({ focused: false });
  };

  onToggleIgnorePassword = () => {
    this.setState({ ignorePassword: !this.state.ignorePassword });
  };

  render() {
    const { className = "", error = "", name, type = "text" } = this.props;
    const { focused, ignorePassword, value } = this.state;

    const isPassword = type === "password";

    return (
      <div
        className={classNames({
          [styles.wrapper]: true,
          [className]: true,
          [styles.hidden]: type === "submit",
        })}
      >
        <div
          className={classNames({
            [styles.main]: true,
            [styles.active]: focused || value.length > 0,
            [styles.error]: error,
          })}
        >
          <input
            className={classNames({
              [styles.input]: true,
              [styles.password]: isPassword,
            })}
            onChange={this.onInputChange}
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            name={name}
            value={value}
            type={isPassword ? (ignorePassword ? "text" : type) : type}
          />
          {isPassword &&
            (ignorePassword ? (
              <EyeOffIcon
                className={classNames(styles.pw_icon, "click")}
                onClick={this.onToggleIgnorePassword}
              />
            ) : (
              <EyeIcon
                className={classNames(styles.pw_icon, "click")}
                onClick={this.onToggleIgnorePassword}
              />
            ))}
          {name && (
            <span
              className={classNames({
                [styles.label]: true,
                [styles.active]: focused || value.length > 0,
                [styles.error]: error,
              })}
            >
              {name}
            </span>
          )}
        </div>
        {error && <div className={styles.errorLabel}>{error}</div>}
      </div>
    );
  }
}

export default Input;
