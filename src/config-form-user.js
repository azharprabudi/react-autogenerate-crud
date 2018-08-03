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
          method: "get",
          config: {},
          replaceUrl: "{id}",
          attributeName: "id"
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
      type: "standard",
      groupName: "Main",
      details: [
        {
          component: "Input",
          componentAttribute: {
            id: "name",
            name: "name",
            label: "Name",
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
            checkName: value => {
              return /^[a-zA-Z]+$/.test(value);
            }
          },
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Name",
          typeColumnTable: "text",
          attributeColumnTable: "name",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "username",
            name: "username",
            label: "Username",
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
          validation: "required",
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Username",
          typeColumnTable: "text",
          attributeColumnTable: "username",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "email",
            name: "email",
            label: "Email",
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
          validation: "required|email",
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Email",
          typeColumnTable: "text",
          attributeColumnTable: "email",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "phone",
            name: "phone",
            label: "Phone",
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
          validation: "required",
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Phone",
          typeColumnTable: "text",
          attributeColumnTable: "phone",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "website",
            name: "website",
            label: "Website",
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
          validation: "required",
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Website",
          typeColumnTable: "text",
          attributeColumnTable: "website",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "TextArea",
          componentAttribute: {
            id: "address",
            name: "address",
            label: "Address",
            style: {},
            type: "text",
            extension: {
              prefix: "rp"
            },
            onAdd: {
              disabled: false,
              readonly: false
            },
            onEdit: {
              disabled: false,
              readonly: false
            }
          },
          validation: "required",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Address",
          typeColumnTable: "text",
          attributeColumnTable: "address",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Radio",
          componentAttribute: {
            id: "gender",
            name: "gender[]",
            label: "Gender",
            style: {},
            type: "text",
            extension: {
              customSource: {
                url: "https://jsonplaceholder.typicode.com/users",
                method: "get",
                config: {}
              },
              idAttributeName: "id",
              labelAttributeName: "name"
            },
            onAdd: {
              disabled: false,
              readonly: false
            },
            onEdit: {
              disabled: false,
              readonly: false
            }
          },
          validation: "required",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Address",
          typeColumnTable: "text",
          attributeColumnTable: "address",
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
