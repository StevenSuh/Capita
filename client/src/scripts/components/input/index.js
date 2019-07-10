import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.css';

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      value: '',
    };
  }

  onInputChange = e => {
    const {
      onChange = () => {},
    } = this.props;
    const { value } = e.target;

    this.setState({ ...this.state, value });
    onChange(value);
  }

  onInputFocus = () => {
    this.setState({ ...this.state, focused: true });
  }

  onInputBlur = () => {
    this.setState({ ...this.state, focused: false });
  }

  render() {
    const {
      className = '',
      error = '',
      name,
      type = "text",
    } = this.props;
    
    return (
      <div className={classNames({
        [styles.wrapper]: true,
        [className]: true,
        [styles.hidden]: type === 'submit',
      })}>
        <div className={classNames({
          [styles.main]: true,
          [styles.active]: this.state.focused || this.state.value.length > 0,
          [styles.error]: this.props.error,
        })}>
          <input
            className={styles.input}
            onChange={this.onInputChange}
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            name={name}
            value={this.state.value}
            type={type}
          />
          {name && (
            <span className={classNames({
              [styles.label]: true,
              [styles.active]: this.state.focused || this.state.value.length > 0,
              [styles.error]: this.props.error,
            })}>
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
