import React from "react";
import classNames from "classnames";

import { ReactComponent as SurprisedIcon } from "assets/icons/surprised.svg";
import styles from "./styles.module.css";

const Empty = ({ className, message = "It's empty!" }) => {
  return (
    <div className={classNames(styles.main, className)}>
      <SurprisedIcon className={styles.icon} />
      <div className={styles.message}>{message}</div>
    </div>
  );
};

export default Empty;
