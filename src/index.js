import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import BaseTable from "./base";
import BaseForm from "./base/base-form";

class Index extends Component {
  render() {
    return (
      <Fragment>
        <BaseForm
          formOptions={{
            main: {
              title: "Test",
              type: "standard",
              groupName: "Main",
              details: [
                {
                  class: "",
                  style: {},
                  id: "name",
                  type: "text",
                  label: "Name",
                  objName: "",
                  onEdit: {
                    isDisabled: "", // boolean
                    isReadonly: "" // bolean
                  },
                  validation: "required|characteryOnly|validationCustom-test",
                  validation_custom: {
                    test: data => {}
                  }
                },
                {
                  class: "",
                  style: {},
                  id: "address",
                  label: "Address",
                  type: "textarea",
                  edit: {
                    attribute: "disabled"
                  },
                  validation: "required"
                }
              ]
            },
            main2: {
              title: "Test",
              type: "standard",
              groupName: "Main",
              details: [
                {
                  class: "",
                  style: {},
                  id: "name",
                  type: "text",
                  label: "Name",
                  objName: "",
                  onEdit: {
                    isDisabled: "", // boolean
                    isReadonly: "" // bolean
                  },
                  validation: "required|characteryOnly|validationCustom-test",
                  validation_custom: {
                    test: data => {}
                  }
                },
                {
                  class: "",
                  style: {},
                  id: "address",
                  label: "Address",
                  type: "textarea",
                  edit: {
                    attribute: "disabled"
                  },
                  validation: "required"
                }
              ]
            }
          }}
        />
        {/*<BaseTable
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
              config: {},
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
              replaceUrl: "{id}",
            },
            edit: {
              url: "https://jsonplaceholder.typicode.com/users/{id}",
              get: {
                enable: false,
                url: "https://jsonplaceholder.typicode.com/users/{id}",
                method: "get",
              },
              config: {},
              method: "patch",
              replaceUrl: "{id}",
              existingDataFromProps: false,
            },
            addNew: {
              url: "https://jsonplaceholder.typicode.com/users",
              method: "post",
              config: {},
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
                title: "TEST",
                objName: "address.geo.lng",
                canBeSort: false,
                type: "custom",
                onCustomValue: data => {
                  return `Name : ${data.name} Username: ${data.username}`;
                }
              }
            ]
          }}
          formOptions={{}}
        />*/}
      </Fragment>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById("app"));
