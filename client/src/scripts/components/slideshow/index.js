import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import detectDrag from 'src/scripts/hoc/detectDrag';

import styles from './styles.module.css';

const DURATION = 5000;
let timeout = null;

const getRoundedIndex = (index, max, increment) => {
  if (increment >= 0) {
    return index + increment === max ? 0 : index + increment;
  }
  return index + increment < 0 ? max - 1 : index + increment;
}

const Slideshow = ({
  className,
  items,
  direction,
  resetDirection,
}) => {
  const [currIndex, setCurrIndex] = useState(0);
  const [slideRight, setSlideRight] = useState(false);

  useEffect(() => {
    const newIndex = getRoundedIndex(currIndex, items.length, 1);
    timeout = setTimeout(() => {
      setSlideRight(false);
      setCurrIndex(newIndex);
    }, DURATION);
  }, [currIndex, items.length]);

  useEffect(() => {
    if (direction.up || direction.down || direction.left || direction.right) {
      if (direction.left) {
        clearTimeout(timeout);
        const newIndex = getRoundedIndex(currIndex, items.length, 1);
        setCurrIndex(newIndex);
        setSlideRight(false);
      }

      if (direction.right) {
        clearTimeout(timeout);
        const newIndex = getRoundedIndex(currIndex, items.length, -1);
        setCurrIndex(newIndex);
        setSlideRight(true);
      }

      resetDirection();
    }
  }, [direction, resetDirection, currIndex, items.length]);

  return (
    <div className={classNames(styles.main)}>
      <TransitionGroup className={classNames(
        "transition-group",
        "slideshow",
        slideRight && "right",
        className,
      )}>
        <CSSTransition
          appear
          classNames="slide"
          key={`${currIndex}-slideshow`}
          timeout={{ enter: 500, exit: 500 }}
          unmountOnExit
        >
          {items[currIndex]}
        </CSSTransition>
      </TransitionGroup>
      <div className={styles.dots}>
        {items.map((_, index) => (
          <div
            className={classNames({
              [styles.dot]: true,
              [styles.active]: index === currIndex,
            })}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default detectDrag(Slideshow)();
