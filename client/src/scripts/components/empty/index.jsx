import React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

const Empty = ({ className, icon, message = "It's empty!" }) => {
  return (
    <div className={classNames(styles.main, className)}>
      {icon}
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default Empty;
