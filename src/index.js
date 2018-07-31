import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import CRUDGenerate from "./base";
import config from "./config-form-user";

class Index extends Component {
  render() {
    return <CRUDGenerate {...config} />;
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
