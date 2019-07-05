import React from 'react';
import classNames from 'classnames';

import { ReactComponent as LoadingIcon } from 'src/assets/icons/loading.svg';
import styles from './styles.module.css';

const Loading = props => (
    <div className={classNames(
      styles.main,
      props.className,
      props.size,
    )}>
      <LoadingIcon className={styles.icon} />
    </div>
  );

export default Loading;
