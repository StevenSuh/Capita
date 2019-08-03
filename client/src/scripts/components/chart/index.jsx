import React from "react";
import { Line } from "react-chartjs-2";
import classNames from "classnames";

import styles from "./styles.module.css";

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMoving: false,
      x: 0,
      boundary: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      offsetLeft: 0,
    };

    this.chartRef = React.createRef();
    this.chartWrapperRef = React.createRef();
  }

  componentDidMount() {
    const { left } = this.chartWrapperRef.current.getBoundingClientRect();
    this.setState({ offsetLeft: left });
  }

  afterBuildTicks = data => chart => {
    const tickSize = Math.round(Math.max(...data) / 4);

    chart.ticks = [];
    chart.ticks.push(tickSize);
    chart.ticks.push(tickSize * 2);
    chart.ticks.push(tickSize * 3);
  };

  getElementAtEvent = (event, elems = []) => {
    const { button, buttons, clientX, target, touches = [] } = event;
    const leftClick = button === 1 || buttons === 1;
    const touch = touches.length > 0;

    if ((leftClick || touch) && elems.length > 0) {
      const { boundary, isMoving, offsetLeft } = this.state;
      const { onDetectValue = () => {} } = this.props;

      const index = elems[0]._index;
      const dataset = elems[0]._chart.data.datasets[0].data;
      const value = dataset[index];
      const x = touch ? touches[0].clientX - offsetLeft : clientX - offsetLeft;

      const updateState = { isMoving: true, x };

      if (!boundary.top) {
        const { top, left, bottom, right } = target.getBoundingClientRect();
        const boundary = { top, left, bottom, right };
        updateState.boundary = boundary;
      }

      if (!isMoving) {
        if (leftClick) {
          document.addEventListener("mouseover", this.onMouseOver);
          document.addEventListener("mouseup", this.onMouseUp);
        }
        if (touch) {
          document.addEventListener("touchmove", this.onTouchMove);
          document.addEventListener("touchend", this.onTouchEnd);
        }
      }

      onDetectValue(value);
      this.setState(updateState);
    }
  };

  onMouseOver = ({ clientX, clientY }) => {
    const { allowXOut, allowYOut, onDetectReset = () => {} } = this.props;
    const {
      isMoving,
      boundary: { top, left, bottom, right },
    } = this.state;

    if (isMoving) {
      const outOfX = allowXOut ? false : clientX < left || clientX > right;
      const outOfY = allowYOut ? false : clientY < top || clientY > bottom;

      if (outOfX || outOfY) {
        onDetectReset();
        this.setState({ isMoving: false, boundary: {} });
        document.removeEventListener("mouseover", this.onMouseOver);
        document.removeEventListener("mouseup", this.onMouseUp);
      }
    }
  };

  onMouseUp = () => {
    if (this.state.isMoving) {
      const { onDetectReset = () => {} } = this.props;

      onDetectReset();
      this.setState({ isMoving: false, boundary: {} });
      document.removeEventListener("mouseover", this.onMouseOver);
      document.removeEventListener("mouseup", this.onMouseUp);
    }
  };

  onTouchMove = ({ touches }) => {
    const { clientX, clientY } = touches[0];
    const { allowXOut, allowYOut, onDetectReset = () => {} } = this.props;
    const {
      isMoving,
      boundary: { top, left, bottom, right },
    } = this.state;

    if (isMoving) {
      const outOfX = allowXOut ? false : clientX < left || clientX > right;
      const outOfY = allowYOut ? false : clientY < top || clientY > bottom;

      if (outOfX || outOfY) {
        onDetectReset();
        this.setState({ isMoving: false, boundary: {} });
        document.removeEventListener("touchmove", this.onTouchMove);
        document.removeEventListener("touchend", this.onTouchEnd);
      }
    }
  };

  onTouchEnd = () => {
    if (this.state.isMoving) {
      const { onDetectReset = () => {} } = this.props;

      onDetectReset();
      this.setState({ isMoving: false, boundary: {} });
      document.removeEventListener("touchmove", this.onTouchMove);
      document.removeEventListener("touchend", this.onTouchEnd);
    }
  };

  render() {
    const { data, range } = this.props;
    const { isMoving, x } = this.state;

    return (
      <div className={styles.main} ref={this.chartWrapperRef}>
        <Line
          ref={this.chartRef}
          data={{
            labels: range,
            datasets: [
              {
                borderColor: "#444444",
                borderWidth: 2,
                lineTension: 0,
                fill: false,
                data,
                pointBackgroundColor: "rgba(0, 0, 0, 0)",
                pointBorderColor: "rgba(0, 0, 0, 0)",
                pointBorderWidth: 0,
                pointHoverBorderWidth: 0,
              },
            ],
          }}
          options={{
            events: ["mousemove", "touchstart", "touchmove"],
            hover: {
              axis: "x",
              intersect: false,
            },
            onHover: this.getElementAtEvent,
            animation: {
              duration: 0,
              onComplete() {
                this.options.animation.duration = 300;
                this.options.animation.onComplete = null;
                this.update();
              },
            },
            layout: {
              padding: {
                top: 15,
                left: -10,
                bottom: 10,
              },
            },
            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              ],
              yAxes: [
                {
                  position: "left",
                  gridLines: {
                    borderDash: [5, 5],
                    color: "#eaeaea",
                    // display: false,
                    drawBorder: false,
                    lineWidth: 2,
                  },
                  ticks: {
                    display: false,
                  },
                  afterBuildTicks: this.afterBuildTicks(data),
                },
              ],
            },
            tooltips: {
              enabled: false,
            },
          }}
        />
        <div
          className={classNames(styles.line, isMoving && styles.active)}
          style={{ left: `${x}px` }}
        />
      </div>
    );
  }
}

export default Chart;
