import React from "react";
import classNames from "classnames";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import * as utils from "utils";
import styles from "./styles.module.css";

class Ticker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: [],
      currAmounts: [this.props.amount || 0, 0],
      height: 0,
    };

    this.targetRef = React.createRef();
  }

  timeout = null;

  componentDidMount() {
    const target = this.targetRef.current;
    const item = document.getElementsByClassName(styles.item);

    this.timeout = setTimeout(() => {
      const height = target.clientHeight - 4;
      const width = item[0].clientWidth;
      document.documentElement.style.setProperty(
        "--ticker-width",
        `${width * 2}px`,
      );
      this.setState({ height });
    }, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    document.documentElement.style["--ticker-width"] = "";
  }

  static getDerivedStateFromProps({ amount }, { currAmounts }) {
    if (currAmounts[0] !== amount) {
      // force CSS repaint trick
      const els = document.getElementsByClassName(styles.number_wrapper);
      for (let i = 0; i < els.length; i++) {
        void els[i].offsetHeight;
      }
      return {
        currAmounts: [amount, currAmounts[0]],
      };
    }
    return null;
  }

  enterAnimation = [
    { opacity: 0, maxWidth: "0px" },
    { opacity: 1, maxWidth: "var(--ticker-width)" },
  ];

  exitAnimation = [
    { opacity: 1, maxWidth: "var(--ticker-width)" },
    { opacity: 0, maxWidth: "0px" },
  ];

  timing = {
    duration: 200,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    fill: "forwards",
  };

  onEntering = elem => elem.animate(this.enterAnimation, this.timing);
  onExiting = elem => elem.animate(this.exitAnimation, this.timing);

  render() {
    const { amount: rawAmount, className } = this.props;
    const { currAmounts: rawCurrAmounts } = this.state;

    const amount = utils.convertAmountToCurrency(rawAmount);
    const currAmount = utils.convertAmountToCurrency(rawCurrAmounts[1]);
    const indexDiff = amount.length - currAmount.length;

    return (
      <div className={styles.wrapper} ref={this.targetRef}>
        <TransitionGroup className={classNames(styles.main, className)}>
          {amount.split("").map((item, index) => {
            if (!item.match(/^\d+$/)) {
              return (
                <CSSTransition
                  classNames="ticker"
                  key={index}
                  timeout={200}
                  onEntering={this.onEntering}
                  onExiting={this.onExiting}
                  unmountOnExit
                >
                  <div className={styles.item}>{item}</div>
                </CSSTransition>
              );
            }

            const currItem = currAmount[index - indexDiff];
            const currIsEmpty = Boolean(!currItem || !currItem.match(/^\d+$/));
            const newNumber = Number(item);
            const currNumber = Number(currItem) || 0;

            const diff = !currIsEmpty ? newNumber - currNumber : newNumber;
            const number = currNumber + 10;
            const range = [];
            const totalTranslate = this.state.height * diff;

            if (diff < 0) {
              for (let i = number - 10; i < number; i++) {
                const str = i.toString();
                range.push(str[str.length - 1]);
              }
            }
            range.push(currNumber);
            if (diff > 0) {
              for (let i = number + 1; i <= number + 10; i++) {
                const str = i.toString();
                range.push(str[str.length - 1]);
              }
            }

            return (
              <CSSTransition
                classNames="ticker"
                key={index}
                timeout={200}
                onEntering={this.onEntering}
                onExiting={this.onExiting}
                unmountOnExit
              >
                <div className={classNames(styles.item, styles.number)}>
                  <div className={styles.placeholder}>0</div>
                  <div
                    className={classNames(
                      styles.number_wrapper,
                      diff < 0 && styles.reverse,
                    )}
                    style={{ transform: `translateY(${totalTranslate}px)` }}
                  >
                    {range.map((item, index) => (
                      <div
                        className={classNames({
                          [styles.hidden]:
                            currIsEmpty && diff !== 0 && index === 0,
                        })}
                        key={index}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    );
  }
}

export default Ticker;
