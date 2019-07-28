import React from "react";

const DetectDragHoc = WrappedComponent => (distance = 50) => {
  class DetectDrag extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        dragging: false,
        direction: {},
        x: 0,
        y: 0,
      };
    }

    componentDidMount() {
      document.addEventListener("mouseup", this.onEndDrag);
      document.addEventListener("touchend", this.onEndDrag);
    }

    componentWillUnmount() {
      document.removeEventListener("mouseup", this.onEndDrag);
      document.removeEventListener("touchend", this.onEndDrag);
    }

    onStartDrag = e => {
      let { pageX, pageY } = e;

      if (e.changedTouches) {
        if (e.changedTouches.length > 1) {
          return;
        }
        pageX = e.changedTouches[0].pageX;
        pageY = e.changedTouches[0].pageY;
      }

      this.setState({
        dragging: true,
        direction: {},
        x: pageX,
        y: pageY,
      });
    };

    onEndDrag = e => {
      if (!this.state.dragging) {
        return;
      }

      let { pageX, pageY } = e;

      if (e.changedTouches) {
        if (e.changedTouches.length > 1) {
          return;
        }
        pageX = e.changedTouches[0].pageX;
        pageY = e.changedTouches[0].pageY;
      }

      const xDiff = pageX - this.state.x;
      const yDiff = pageY - this.state.y;

      const direction = {
        up: yDiff < -distance,
        down: yDiff > distance,
        left: xDiff < -distance,
        right: xDiff > distance,
      };

      this.setState({
        dragging: false,
        direction,
        x: 0,
        y: 0,
      });
    };

    render() {
      return (
        <div onMouseDown={this.onStartDrag} onTouchStart={this.onStartDrag}>
          <WrappedComponent
            {...this.props}
            direction={this.state.direction}
            resetDirection={() => this.setState({ direction: {} })}
          />
        </div>
      );
    }
  }

  return DetectDrag;
};

export default DetectDragHoc;
