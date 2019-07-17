import React from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import detectDrag from 'scripts/hoc/detectDrag';

import styles from './styles.module.css';

const DURATION = 5000;
let timeout = null;

class Slideshow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currIndex: 0,
      slideRight: false,
    };
  }

  getRoundedIndex = (index, max, increment) => {
    if (increment >= 0) {
      return index + increment === max ? 0 : index + increment;
    }
    return index + increment < 0 ? max - 1 : index + increment;
  };

  componentDidMount() {
    this.updateIndexTimeout();
  }

  componentDidUpdate(_, prevState) {
    const { currIndex } = this.state;
    const { items } = this.props;
    const dir = this.props.direction;

    if (dir.up || dir.down || dir.left || dir.right) {
      if (dir.left || dir.right) {
        clearTimeout(timeout);
        timeout = null;

        const newIndex = this.getRoundedIndex(
          currIndex,
          items.length,
          dir.left ? 1 : -1,
        );
        this.setState({
          ...this.state,
          currIndex: newIndex,
          slideRight: dir.right,
        });
      }
      this.props.resetDirection();
    }

    if (currIndex !== prevState.currIndex) {
      this.updateIndexTimeout();
    }
  }

  componentWillUnmount() {
    clearTimeout(timeout);
    timeout = null;
  }

  updateIndexTimeout = () => {
    const { currIndex } = this.state;
    const { items } = this.props;

    const newIndex = this.getRoundedIndex(currIndex, items.length, 1);
    timeout = setTimeout(() => {
      if (!timeout) {
        return;
      }
      this.setState({
        ...this.state,
        currIndex: newIndex,
        slideRight: false,
      });
    }, DURATION);
  };

  render() {
    const { className, items } = this.props;
    const { currIndex, slideRight } = this.state;
    
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
  }
}

export default detectDrag(Slideshow)();
