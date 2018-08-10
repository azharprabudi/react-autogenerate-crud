import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import CRUDGenerate from "./crud-generate";
import config from "./config-form-user";

class Index extends Component {
  render() {
    return (
      <div style={{ display: "inline" }}>
        <h1>hello azhar</h1>
        <CRUDGenerate {...config} />
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
