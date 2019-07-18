import React from "react";
import classNames from "classnames";

import { ReactComponent as LoadingIcon } from "assets/icons/loading.svg";
import styles from "./styles.module.css";

const Loading = ({ className, size }) => (
  <div className={classNames(styles.main, className, styles[size])}>
    <LoadingIcon className={styles.icon} />
  </div>
);

export default Loading;
