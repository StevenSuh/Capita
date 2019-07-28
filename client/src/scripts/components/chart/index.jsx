import React from "react";
import { defaults, Line } from "react-chartjs-2";
import classNames from "classnames";

import styles from "./styles.module.css";

defaults.global.animation = false;

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMoving: false,
      x: 0,
    };

    this.chartRef = React.createRef();
  }

  afterBuildTicks = data => chart => {
    const tickSize = Math.round(Math.max(...data) / 4);

    chart.ticks = [];
    chart.ticks.push(tickSize);
    chart.ticks.push(tickSize * 2);
    chart.ticks.push(tickSize * 3);
  };

  getElementAtEvent = ({ button, buttons, clientX }, elems) => {
    const { isMoving } = this.state;
    const leftClick = button === 1 || buttons === 1;

    if (isMoving) {
      if (!leftClick) {
        // TODO: manually check for mouseout through clientBoundingRects
        this.setState({ isMoving: false });
        return;
      }
    }

    if (leftClick && elems.length > 0) {
      const { onDetectValue = () => {} } = this.props;

      const index = elems[0]._index;
      const dataset = elems[0]._chart.data.datasets[0].data;
      const value = dataset[index];
      const x = clientX - 20;

      onDetectValue(value);
      this.setState({ isMoving: true, x });
    }
  };

  render() {
    const { data, range } = this.props;
    const { isMoving, x } = this.state;

    return (
      <div className={styles.main}>
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
            // animation: {
            //   onComplete: () => (defaults.global.animation = true),
            // },
            layout: {
              padding: {
                top: 5,
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
                  gridLines: {
                    borderDash: [5, 5],
                    color: "#d0d0d0",
                    // display: false,
                    drawBorder: false,
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
