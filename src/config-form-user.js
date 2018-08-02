import React from "react";

const config = {
  aclId: "*",
  aclRules: {
    "*": {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    }
  },
  initialLimit: 10,
  title: "Users",
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
          url: "https://jsonplaceholder.typicode.com/users/{id}",
          method: "get"
        },
        config: {},
        method: "patch",
        replaceUrl: "{id}",
        attributeName: "id",
        dataFromProps: false,
        callbackBeforeUpdate: () => {},
        callbackAfterUpdate: () => {}
      },
      delete: {
        url: "https://jsonplaceholder.typicode.com/users/{id}",
        bulk: {
          enable: true,
          method: "get",
          url: "https://jsonplaceholder.typicode.com/users/{id}",
          callbackBeforeDeleteBulk: () => {},
          callbackAfterDeleteBulk: () => {}
        },
        config: {},
        method: "delete",
        replaceUrl: "{id}",
        attributeName: "id",
        callbackBeforeDelete: () => {},
        callbackAfterDelete: () => {}
      }
    }
  },
  table: {
    buttonTopTable: {},
    row: {
      replaceUrl: "{id}",
      attributeName: "id",
      additionalButtons: {}
    }
  },
  loading: {
    color: "primary",
    size: 40
  },
  fields: [
    {
      title: "Utama",
      type: "standar",
      groupName: "Main",
      details: [
        {
          component: "Input",
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
            }
          },
          validation: "required|minLength[5]|callback_checkName",
          callbackValidation: {
            checkName: () => true
          },
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "AIDEH",
          typeColumnTable: "text",
          attributeColumnTable: "id",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "name",
            name: "name",
            label: "name",
            style: {},
            type: "text",
            onAdd: {
              disabled: false,
              readonly: false
            },
            onEdit: {
              disabled: false,
              readonly: false
            }
          },
          validation: "required|minLength[5]|callback_checkName",
          callbackValidation: {
            checkName: () => true
          },
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "NAME",
          typeColumnTable: "text",
          attributeColumnTable: "name",
          prefixColumnTable: "",
          allowSearch: true
        }
      ]
    }
  ],
  export: {
    url: "",
    type: "csv"
  }
};

export default config;
