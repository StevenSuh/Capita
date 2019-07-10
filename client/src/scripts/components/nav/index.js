import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.css';

const Nav = props => (
  <div className={classNames(
    styles.main,
    props.className,
  )}>
    {props.items.map((row, index) => (
      <div className={styles.row} key={index}>
        {row.map(({ item, onClick }, index) => (
          <div
            className={styles.item}
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

export default Nav;
