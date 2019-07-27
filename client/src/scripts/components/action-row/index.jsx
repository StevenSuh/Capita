import React from "react";
import classNames from "classnames";

import { ReactComponent as ArrowRightIcon } from "assets/icons/arrow-right.svg";
import styles from "./styles.module.css";

const ActionRow = ({
  alignLeft = false,
  className,
  container = true,
  title,
  subtitle,
  titleClassName,
  border = true,
  rightItem = <ArrowRightIcon className="click" />,
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
        className,
      )}
      onClick={onMainClick ? onMainClick : () => {}}
    >
      <div
        className={classNames(
          styles.main,
          container && "container",
          !border && styles.margin_bottom,
        )}
      >
        {leftItem && <div onClick={onLeftClick}>{leftItem}</div>}
        <div className={classNames(styles.titles, alignLeft && styles.left)}>
          <h4 className={classNames(styles.title, titleClassName)}>{title}</h4>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {rightItem && <div onClick={onRightClick}>{rightItem}</div>}
      </div>
    </div>
  );
};

export default ActionRow;
