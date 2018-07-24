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
            url: "https://jsonplaceholder.typicode.com/users",
            method: "get",
            query: {
              limit: "_limit",
              page: "_page",
              search: {}
            }
          },
          delete: {
            url: "https://jsonplaceholder.typicode.com/users/{id}",
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
              title: "Name",
              objName: "name",
              canBeSort: true,
              type: "text"
            },
            {
              title: "Username",
              objName: "username",
              canBeSort: true,
              type: "text"
            },
            {
              title: "Email",
              objName: "email",
              canBeSort: true,
              type: "text"
            },
            {
              title: "Alamat",
              objName: "address.street",
              canBeSort: true,
              type: "text"
            },
            {
              title: "Lang",
              objName: "address.geo.lng",
              canBeSort: true,
              type: "text"
            }
          ]
        }}
      />
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
