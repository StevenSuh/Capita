import React from "react";
import classNames from "classnames";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import { ReactComponent as LockIcon } from "assets/icons/lock.svg";
import styles from "./styles.module.css";

const ActionRow = ({
  title,
  subtitle,
  border = true,
  locked = false,
  onClick = () => {},
  onMainClick,
}) => {
  return (
    <div
      className={classNames(onMainClick && styles.bg, border && styles.border)}
      onClick={onMainClick ? onMainClick : () => {}}
    >
      <div className={classNames(styles.main, "container")}>
        <div className={styles.titles}>
          <h4 className={styles.title}>{title}</h4>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {!locked ? (
          <ArrowRightIcon
            className={classNames(styles.icon, "hover", "click")}
            onClick={onClick}
          />
        ) : (
          <LockIcon className={classNames(styles.icon, styles.lock)} />
        )}
      </div>
    </div>
  );
};

export default ActionRow;
