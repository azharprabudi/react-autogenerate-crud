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
            url: "https://jsonplaceholder.typicode.com/photos",
            method: "get",
            query: {
              limit: "_limit",
              page: "_page",
              search: {}
            }
          },
          delete: {
            url: "https://jsonplaceholder.typicode.com/photos/{id}",
            bulk: false,
            method: "delete",
            replaceUrl: "{id}"
          }
        }}
        tableOptions={{
          btnAddNew: true,
          btnEdit: true,
          columns: [
            {
              title: "Judul",
              objName: "title",
              canBeSort: true,
              type: "text"
            },
            {
              title: "Gambar",
              objName: "url",
              canBeSort: true,
              type: "image"
            }
          ]
        }}
      />
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
