import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import CRUDGenerate from "./base";

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
      <CRUDGenerate
        aclId={"*"}
        aclRules={{
          "*": {
            create: true,
            read: true,
            update: true,
            delete: true,
            export: true,
            import: true
          }
        }}
        initialLimit={10}
        title={"Daftar Pegawai"}
        options={{
          server: {
            http: {
              create: {
                url: "https://jsonplaceholder.typicode.com/users",
                method: "post",
                config: {},
                callbackBeforeCreate: () => {},
                callbackAfterCreate: () => {}
              },
              read: {
                url: "https://jsonplaceholder.typicode.com/users",
                method: "get",
                query: {
                  limit: "_limit",
                  page: "_page",
                  search: {}
                },
                config: {},
                callbackBeforeRead: () => {},
                callbackAfterRead: () => {}
              },
              update: {
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
                existingDataFromProps: false,
                callbackBeforeUpdate: () => {},
                callbackAfterUpdate: () => {}
              },
              delete: {
                url: "https://jsonplaceholder.typicode.com/users/{id}",
                bulk: {
                  enable: true,
                  method: "get",
                  attributeName: "id",
                  url: "https://jsonplaceholder.typicode.com/users/{id}"
                },
                config: {},
                method: "delete",
                replaceUrl: "{id}",
                callbackBeforeDelete: () => {},
                callbackAfterDelete: () => {}
              }
            }
          },
          table: {
            header: {
              buttons: {}
            },
            body: {
              rows: {
                buttons: {},
                replaceUrl: {
                  "{id}": 1
                }
              }
            }
          },
          fields: [
            {
              component: "Input",
              groupName: "Main",
              componentAttribute: {
                id: "id",
                name: "id",
                label: "Id",
                style: {},
                type: "text",
                onAdd: {
                  disabled: false,
                  readonly: false
                },
                onEdit: {
                  disabled: false,
                  readonly: false
                },
                validation: "required|minLength[5]|callback_checkName",
                callbackValidation: {
                  checkName: () => true
                },
                showOnTable: true,
                mergingColumn: false,
                sortColumnTable: true,
                columnNameTable: "AIDI",
                allowSearch: true
              }
            }
          ]
        }}
      />
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
