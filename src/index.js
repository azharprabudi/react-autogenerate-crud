import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import BaseTable from "./base";

class Index extends Component {
  render() {
    return (
      <BaseTable
        existingData={false}
        fetchOptions={{
          get: {
            url: "https://jsonplaceholder.typicode.com/posts/"
          }
        }}
        tableOptions={{
          btnAddNew: true,
          btnEdit: true,
          columns: [
            {
              title: "Judul",
              objName: "title",
              canBeSort: true
            },
            {
              title: "Deskripsi",
              objName: "body"
            }
          ]
        }}
      />
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
