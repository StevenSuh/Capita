import React from "react";
import classNames from "classnames";

import { ReactComponent as CheckIcon } from "assets/icons/check.svg";
import styles from "./styles.module.css";

const SelectButton = ({
  className,
  active = false,
  multiple = false,
  show = true,
  onClick = () => {},
}) => {
  return (
    <div
      className={classNames(
        styles.select_wrapper,
        show && styles.show,
        className,
      )}
    >
      <div
        className={classNames({
          [styles.select]: true,
          [styles.multiple]: multiple,
          [styles.active]: active,
        })}
        onClick={onClick}
      >
        <CheckIcon className={styles.icon} />
      </div>
    </div>
  );
};

export default SelectButton;
