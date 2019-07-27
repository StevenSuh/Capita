import React from "react";
import classNames from "classnames";

import * as utils from "utils";
import styles from "./styles.module.css";

class Ticker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: [],
      currAmount: this.props.amount,
      height: 0,
    };

    this.targetRef = React.createRef();
  }

  componentDidMount() {
    const height = this.targetRef.current.clientHeight - 4;
    this.setState({ height });
  }

  componentDidUpdate(prevProps) {
    const { amount } = this.props;

    if (prevProps.amount !== amount) {
      this.setState({ currAmount: prevProps.amount });

      // force CSS repaint trick
      const els = document.getElementsByClassName(styles.number_wrapper);
      for (let i = 0; i < els.length; i++) {
        void els[i].offsetHeight;
      }
    }
  }

  render() {
    const { amount: rawAmount, className } = this.props;
    const { currAmount: rawCurrAmount } = this.state;

    const amount = utils.convertAmountToCurrency(rawAmount);
    const currAmount = utils.convertAmountToCurrency(rawCurrAmount);
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
          const totalTranslate = this.state.height * diff * (diff < 0 ? 1 : -1);

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
