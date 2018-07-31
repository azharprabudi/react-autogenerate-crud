import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import BaseTable from "./base";
import BaseForm from "./base/base-form";

/*
  note : 
  1. acl
  2. showOnTable merge fetch options & tableOptions
  3. import and export
  4. Button import export
*/

class Index extends Component {
  render() {
    return (
      <Fragment>
        <BaseTable
          title={"Daftar Pegawai"}
          limit={10}
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
              },
              config: {}
            },
            delete: {
              url: "https://jsonplaceholder.typicode.com/users/{id}",
              bulk: {
                enable: true,
                url: "https://jsonplaceholder.typicode.com/users/{id}",
                method: "get"
              },
              config: {},
              method: "delete",
              replaceUrl: "{id}"
            },
            edit: {
              url: "https://jsonplaceholder.typicode.com/users/{id}",
              get: {
                enable: false,
                url: "https://jsonplaceholder.typicode.com/users/{id}",
                method: "get"
              },
              config: {},
              method: "patch",
              objName: "id",
              replaceUrl: "{id}",
              existingDataFromProps: false
            },
            addNew: {
              url: "https://jsonplaceholder.typicode.com/users",
              method: "post",
              config: {}
            }
          }}
          tableOptions={{
            buttonTopTable: {},
            additionalButtons: {
              enable: true,
              replaceUrl: {
                "{id}": "id"
              },
              button: {}
            },
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
              },
              {
                title: "Merging Column Cannot Sort",
                objName: "address.geo.lng",
                canBeSort: false,
                type: "custom",
                onCustomValue: data => {
                  return `Name : ${data.name} Username: ${data.username}`;
                }
              }
            ]
          }}
          formOptions={[
            {
              title: "Test",
              type: "standard",
              groupName: "Main",
              details: [
                {
                  component: "Input",
                  attribute: {
                    style: {},
                    class: "",
                    id: "firstName",
                    name: "firstName",
                    type: "text",
                    label: "First Name",
                    edit: {
                      disabled: false,
                      readonly: false
                    },
                    addNew: {
                      disabled: false,
                      readonly: false
                    }
                  },
                  allowSearch: true,
                  validation: "required|minLength[5]|callback_checkName",
                  callback: {
                    checkName: data => {
                      console.log(data);
                      return true;
                    }
                  }
                }
              ]
            }
          ]}
        />
      </Fragment>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
