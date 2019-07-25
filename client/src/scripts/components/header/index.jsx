import React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

const Header = ({
  leftItem = <div className={styles.item} />,
  rightItem = <div className={styles.item} />,
  title,
  titleClassName,
  subtitle,
  subtitleClassName,
}) => {
  return (
    <div className={classNames(styles.main, "container")}>
      {leftItem}
      <div className={styles.center}>
        <h1 className={classNames(styles.title, titleClassName)}>{title}</h1>
        {subtitle && (
          <h4 className={classNames(styles.subtitle, subtitleClassName)}>
            {subtitle}
          </h4>
        )}
      </div>
      {rightItem}
    </div>
  );
};

export default Header;
