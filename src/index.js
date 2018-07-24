import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import BaseTable from "./base";

class Index extends Component {
  render() {
    return (
      <BaseTable
        title={"Daftar Pegawai"}
        checkboxOptions={{
          enable: true,
          objName: "id"
        }}
        fetchOptions={{
          view: {
            url: "https://jsonplaceholder.typicode.com/posts",
            method: "get",
            query: {
              limit: "_limit",
              page: "_page",
              search: {}
            }
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
              objName: "body",
              canBeSort: true
            }
          ]
        }}
      />
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
