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
  options: {
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
          replaceUrl: "{id}",
          attributeName: "id",
          existingDataFromProps: false,
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
      header: {
        buttons: {}
      },
      body: {
        rows: {
          buttons: {},
          replaceUrl: "{id}",
          attributeName: "id"
        }
      }
    },
    loading: {
      color: "primary",
      size: 40
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
  }
};

export default config;
