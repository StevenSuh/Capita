import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.css';

const Snackbar = props => (
    <div className={classNames(
      styles.main,
      props.className,
      props.type,
    )}>
    </div>
  );

export default Snackbar;
