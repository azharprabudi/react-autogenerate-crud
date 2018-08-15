import React from "react";
import random from "lodash/random";

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
  title: "Articles",
  server: {
    http: {
      create: {
        url: "http://localhost:3000/article",
        method: "post",
        config: {},
        callbackBeforeCreate: ({ data }) => {
          return {
            isContinue: true,
            data: {
              ...data,
              id: random(100, 400),
              comments: data.comments.map(item => ({
                ...item,
                id: random(500, 1000)
              }))
            },
            error: ""
          };
        },
        callbackAfterCreate: () => {}
      },
      read: {
        url: "http://localhost:3000/article",
        query: {
          limit: "_limit",
          page: "_page",
          sort: "_sort={orderName}&_order={orderBy}",
          callbackBeforeSearch: url => url
        },
        config: {}
      },
      update: {
        url: "http://localhost:3000/article/{id}",
        get: {
          url: "http://localhost:3000/article/{id}",
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
        url: "http://localhost:3000/article/{id}",
        bulk: {
          enable: true,
          method: "get",
          url: "http://localhost:3000/article/{id}",
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
      title: "General",
      type: "standard",
      groupName: "Main",
      details: [
        {
          component: "Input",
          componentAttribute: {
            id: "id",
            name: "id",
            label: "",
            type: "hidden",
            onAdd: {
              disabled: false,
              readonly: false
            },
            onEdit: {
              disabled: false,
              readonly: false
            }
          },
          validation: "",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: false,
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "id",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectAutoComplete",
          componentAttribute: {
            id: "categoryArticleId",
            name: "categoryArticleId",
            label: "Article Category",
            type: "text",
            onAdd: {
              disabled: false,
              readonly: false
            },
            onEdit: {
              disabled: false,
              readonly: false
            },
            extension: {
              customSource: {
                url: "http://localhost:3000/category-article"
              },
              idAttributeName: "id",
              labelAttributeName: "name"
            }
          },
          validation: "required",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: false,
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "categoryArticleId",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectAutoComplete",
          componentAttribute: {
            id: "creator",
            name: "creator",
            label: "Creator",
            type: "text",
            onAdd: {
              disabled: false,
              readonly: false
            },
            onEdit: {
              disabled: false,
              readonly: false
            },
            extension: {
              customSource: {
                url: "http://localhost:3000/user"
              },
              idAttributeName: "id",
              labelAttributeName: "name"
            }
          },
          validation: "required",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: false,
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "creator",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "createdAt",
            name: "createdAt",
            label: "Created At",
            type: "datetime-local",
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
          titleColumnTable: "Created At",
          typeColumnTable: "datetime",
          attributeColumnTable: "createdAt",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "viewers",
            name: "viewers",
            label: "Viewers",
            type: "number",
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
          titleColumnTable: "Viewers",
          typeColumnTable: "text",
          attributeColumnTable: "viewers",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "title",
            name: "title",
            label: "Title",
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
          titleColumnTable: "Title",
          typeColumnTable: "text",
          attributeColumnTable: "title",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "CustomEditor",
          componentAttribute: {
            id: "content",
            name: "content",
            label: "Content",
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
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Content",
          typeColumnTable: "longtext",
          attributeColumnTable: "content",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectMultipleAutoComplete",
          componentAttribute: {
            id: "tag",
            name: "tag",
            label: "Tag",
            type: "text",
            onAdd: {
              disabled: false,
              readonly: false
            },
            onEdit: {
              disabled: false,
              readonly: false
            },
            extension: {
              customSource: {
                url: "http://localhost:3000/tag"
              },
              idAttributeName: "id",
              labelAttributeName: "name"
            }
          },
          validation: "required",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: false,
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "tag",
          prefixColumnTable: "",
          allowSearch: true
        }
      ]
    },
    {
      title: "Details",
      type: "details",
      groupName: "details_1",
      attributeNameDetails: "comments",
      details: [
        {
          component: "Select",
          componentAttribute: {
            id: "user",
            name: "user",
            label: "Select Details Standar",
            type: "text",
            onAdd: {
              disabled: false,
              readonly: false
            },
            onEdit: {
              disabled: false,
              readonly: false
            },
            extension: {
              customSource: {
                url: "http://localhost:3000/user"
              },
              idAttributeName: "id",
              labelAttributeName: "name"
            }
          },
          validation: "required",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "User",
          typeColumnTable: "text",
          attributeColumnTable: "user",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "like",
            name: "like",
            label: "Like",
            type: "number",
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
          titleColumnTable: "Like",
          typeColumnTable: "text",
          attributeColumnTable: "like",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "CustomEditor",
          componentAttribute: {
            id: "content",
            name: "content",
            label: "Content",
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
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Content",
          typeColumnTable: "text",
          attributeColumnTable: "content",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "createdAt",
            name: "createdAt",
            label: "Created At",
            type: "datetime-local",
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
          titleColumnTable: "Created At",
          typeColumnTable: "text",
          attributeColumnTable: "createdAt",
          prefixColumnTable: "",
          allowSearch: true
        }
      ]
    }
  ],
  export: {
    url: "",
    type: "excel"
  },
  import: {
    url: "",
    method: "post",
    config: {},
    callbackBeforeImport: () => {},
    callbackAfterImport: () => {},
    formatValueColumn: {
      "Main.id": "number",
      "Main.categoryArticleId": "number",
      "Main.creator": "number",
      "Main.createdAt": "number",
      "Main.id": "number",
      "Main.id": "number",
      "Main.id": "number"
    }
  },
  additionalFieldsAtForm: {
    top: <h1>This is just example</h1>,
    bottom: <h1>This is just example</h1>
  }
};

export default config;
