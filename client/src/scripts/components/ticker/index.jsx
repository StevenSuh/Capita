import React from "react";
import classNames from "classnames";

import * as utils from "utils";
import styles from "./styles.module.css";

class Ticker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: [],
      currAmounts: [this.props.amount, 0],
      height: 0,
    };

    this.targetRef = React.createRef();
  }

  componentDidMount() {
    const height = this.targetRef.current.clientHeight - 4;
    this.setState({ height });
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

  render() {
    const { amount: rawAmount, className } = this.props;
    const { currAmounts: rawCurrAmounts } = this.state;

    const amount = utils.convertAmountToCurrency(rawAmount);
    const currAmount = utils.convertAmountToCurrency(rawCurrAmounts[1]);
    const indexDiff = amount.length - currAmount.length;

    return (
      <div className={classNames(styles.main, className)} ref={this.targetRef}>
        {amount.split("").map((item, index) => {
          if (!item.match(/^\d+$/)) {
            return (
              <div className={styles.item} key={index}>
                {item}
              </div>
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
            <div className={classNames(styles.item, styles.number)} key={index}>
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
                      [styles.hidden]: currIsEmpty && diff !== 0 && index === 0,
                    })}
                    key={index}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Ticker;
