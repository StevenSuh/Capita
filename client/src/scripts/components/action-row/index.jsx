import React from "react";
import classNames from "classnames";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import styles from "./styles.module.css";

const ActionRow = ({
  left = false,
  title,
  subtitle,
  titleClassName,
  border = true,
  rightItem = (
    <ArrowRightIcon className={classNames(styles.icon, "hover", "click")} />
  ),
  onRightClick = () => {},
  leftItem,
  onLeftClick = () => {},
  onMainClick,
}) => {
  return (
    <div
      className={classNames(
        onMainClick && !border && "click",
        border && "click-bg",
        border && styles.border,
      )}
      onClick={onMainClick ? onMainClick : () => {}}
    >
      <div
        className={classNames(
          styles.main,
          "container",
          !border && styles.margin_bottom,
        )}
      >
        {leftItem && <div onClick={onLeftClick}>{leftItem}</div>}
        <div className={classNames(styles.titles, left && styles.left)}>
          <h4 className={classNames(styles.title, titleClassName)}>{title}</h4>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {rightItem && <div onClick={onRightClick}>{rightItem}</div>}
      </div>
    </div>
  );
};

export default ActionRow;
