import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

class Index extends Component {
  render() {
    return (
      <Fragment>
        <h1>HELO</h1>
      </Fragment>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
