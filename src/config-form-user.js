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
        url: "http://localhost:3000/article",
        method: "post",
        config: {},
        callbackBeforeCreate: () => {},
        callbackAfterCreate: () => {}
      },
      read: {
        url: "http://localhost:3000/article",
        query: {
          limit: "_limit",
          page: "_page",
          search: {}
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
            id: "inputStandar",
            name: "inputStandar",
            label: "Input Standar",
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
          validation: "",
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Id",
          typeColumnTable: "text",
          attributeColumnTable: "id",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "inputValidation",
            name: "inputValidation",
            label: "Input Validation",
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
          component: "Input",
          componentAttribute: {
            id: "inputCustomValidation",
            name: "inputCustomValidation",
            label: "Input Custom Validation",
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
          validation: "required|callback_check",
          validationCallback: {
            check: value => {
              if (/^\S*$/.test(value)) {
                return { validation: true, message: "" };
              }
              return { validation: false, message: "don't allow space" };
            }
          },
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Title",
          typeColumnTable: "text",
          attributeColumnTable: "title",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "InputNominal",
          componentAttribute: {
            id: "inputNominal",
            name: "inputNominal",
            label: "Input Nominal",
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
              prefix: "rp"
            }
          },
          validation: "",
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Viewers",
          typeColumnTable: "nominal",
          attributeColumnTable: "viewers",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "inputDate",
            name: "inputDate",
            label: "Input Date",
            type: "date",
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
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "created",
          typeColumnTable: "datetime",
          attributeColumnTable: "createdAt",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "inputTime",
            name: "inputTime",
            label: "Input Time",
            type: "time",
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
          sortColumnTable: true,
          titleColumnTable: "created",
          typeColumnTable: "text",
          attributeColumnTable: "createdAt",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Input",
          componentAttribute: {
            id: "inputDateTime",
            name: "inputDateTime",
            label: "Input Date Time",
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
          validation: "",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "created",
          typeColumnTable: "text",
          attributeColumnTable: "createdAt",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "FileUploader",
          componentAttribute: {
            id: "inputFile",
            name: "inputFile",
            label: "Upload File",
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
          extension: {
            uploaderConf: {
              minSize: 0,
              maxSize: 3000000,
              allowTypes: "image/jpg"
            }
          },
          validation: "",
          showOnTable: true,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "created",
          typeColumnTable: "image",
          attributeColumnTable: "image",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "TextArea",
          componentAttribute: {
            id: "textareaContent",
            name: "textareaContent",
            label: "TextArea Content",
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
          validation: "",
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
          component: "CustomEditor",
          componentAttribute: {
            id: "customEditorContent",
            name: "customEditorContent",
            label: "Custom Editor Content",
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
              editorConf: {
                img: {
                  uploadUrl: "https://api.imgur.com/3/image",
                  method: "post",
                  config: {
                    headers: {
                      Authorization: "Client-ID 8d26ccd12712fca"
                    }
                  },
                  type: "formData"
                }
              }
            }
          },
          validation: "",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Content",
          typeColumnTable: "text",
          attributeColumnTable: "content",
          prefixColumnTable: "",
          allowSearch: true
        }
      ]
    },
    {
      title: "Own Data",
      type: "standard",
      groupName: "own",
      details: [
        {
          component: "Radio",
          componentAttribute: {
            id: "radioOwnData",
            name: "radioOwnData",
            label: "Category Article",
            type: "text",
            extension: {
              data: [
                {
                  id: 1,
                  name: "Politik"
                },
                {
                  id: 2,
                  name: "Ekonomi"
                },
                {
                  id: 3,
                  name: "Otomotif"
                },
                {
                  id: 4,
                  name: "Education"
                }
              ],
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
          titleColumnTable: "Article Category Radio",
          typeColumnTable: "text",
          attributeColumnTable: "categoryArticleId",
          prefixColumnTable: "",
          allowSearch: true
        },

        {
          component: "Checkbox",
          componentAttribute: {
            id: "checkboxOwnData",
            name: "checkboxOwnData",
            label: "Checkbox",
            type: "text",
            extension: {
              data: [
                {
                  id: 1,
                  name: "Baru"
                },
                {
                  id: 2,
                  name: "2018Informasi"
                },
                {
                  id: 3,
                  name: "Trending Topic"
                },
                {
                  id: 4,
                  name: "Ramaikan"
                }
              ],
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
          titleColumnTable: "Tag",
          typeColumnTable: "text",
          attributeColumnTable: "tag",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Select",
          componentAttribute: {
            id: "selectOwnData",
            name: "selectOwnData",
            label: "Select",
            type: "text",
            extension: {
              data: [
                {
                  id: 1,
                  name: "Tidak Aktif"
                },
                {
                  id: 2,
                  name: "Aktif"
                }
              ],
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
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "isDelete",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectAutoComplete",
          componentAttribute: {
            id: "selectAutoCompleteOwnData",
            name: "selectAutoCompleteOwnData",
            label: "Select Auto Complete",
            type: "text",
            extension: {
              data: [
                {
                  id: 1,
                  name: "Azhar Prabudi"
                },
                {
                  id: 2,
                  name: "Boby Harmoko"
                },
                {
                  id: 3,
                  name: "Boby Hartanto"
                }
              ],
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
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "creator",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectMultiple",
          componentAttribute: {
            id: "selectMultipleOwnData",
            name: "selectMultipleOwnData",
            label: "Select Multiple",
            type: "text",
            extension: {
              data: [
                {
                  id: 1,
                  name: "Baru"
                },
                {
                  id: 2,
                  name: "2018Informasi"
                },
                {
                  id: 3,
                  name: "Trending Topic"
                },
                {
                  id: 4,
                  name: "Ramaikan"
                }
              ],
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
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "tag",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectMultipleAutoComplete",
          componentAttribute: {
            id: "selectMultipleAutoCompleteOwnData",
            name: "selectMultipleAutoCompleteOwnData",
            label: "Select Multiple AutoComplete",
            type: "text",
            extension: {
              data: [
                {
                  id: 1,
                  name: "Baru"
                },
                {
                  id: 2,
                  name: "2018Informasi"
                },
                {
                  id: 3,
                  name: "Trending Topic"
                },
                {
                  id: 4,
                  name: "Ramaikan"
                }
              ],
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
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "tag",
          prefixColumnTable: "",
          allowSearch: true
        }
      ]
    },
    {
      title: "API Data",
      type: "standard",
      groupName: "api",
      details: [
        {
          component: "Radio",
          componentAttribute: {
            id: "radioApiData",
            name: "radioApiData",
            label: "Category Article",
            type: "text",
            extension: {
              customSource: {
                url: "http://localhost:3000/category-article"
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
          titleColumnTable: "Article Category Radio",
          typeColumnTable: "text",
          attributeColumnTable: "categoryArticleId",
          prefixColumnTable: "",
          allowSearch: true
        },

        {
          component: "Checkbox",
          componentAttribute: {
            id: "checkboxApiData",
            name: "checkboxApiData",
            label: "Checkbox",
            type: "text",
            extension: {
              customSource: {
                url: "http://localhost:3000/tag"
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
          titleColumnTable: "Tag",
          typeColumnTable: "text",
          attributeColumnTable: "tag",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Select",
          componentAttribute: {
            id: "selectApiData",
            name: "selectApiData",
            label: "Select",
            type: "text",
            extension: {
              customSource: {
                url: "http://localhost:3000/status"
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
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "isDelete",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectAutoComplete",
          componentAttribute: {
            id: "selectAutoCompleteApiData",
            name: "selectAutoCompleteApiData",
            label: "Select Auto Complete",
            type: "text",
            extension: {
              customSource: {
                url: "http://localhost:3000/user"
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
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "creator",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectAsyncAutoComplete",
          componentAttribute: {
            id: "selectAsyncAutoCompleteApiData",
            name: "selectAsyncAutoCompleteApiData",
            label: "Select Async Auto Complete",
            type: "text",
            extension: {
              customSource: {
                initialUrl: "http://localhost:3000/user?id={id}",
                url: "http://localhost:3000/user?name={name}",
                replaceUrl: {
                  initial: "{id}",
                  url: "{name}"
                }
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
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "creator",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectMultiple",
          componentAttribute: {
            id: "selectMultipleApiData",
            name: "selectMultipleApiData",
            label: "Select Multiple",
            type: "text",
            extension: {
              customSource: {
                url: "http://localhost:3000/tag"
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
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "tag",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectMultipleAutoComplete",
          componentAttribute: {
            id: "selectMultipleAutoCompleteOwnData",
            name: "selectMultipleAutoCompleteOwnData",
            label: "Select Multiple AutoComplete",
            type: "text",
            extension: {
              customSource: {
                url: "http://localhost:3000/tag"
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
          titleColumnTable: "",
          typeColumnTable: "text",
          attributeColumnTable: "tag",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "SelectAsyncMultipleAutoComplete",
          componentAttribute: {
            id: "selectAsyncMultipleAutoCompleteOwnData",
            name: "selectAsyncMultipleAutoCompleteOwnData",
            label: "Select Async Multiple AutoComplete",
            type: "text",
            extension: {
              customSource: {
                initialUrl: "http://localhost:3000/tag?id={id}",
                url: "http://localhost:3000/tag?name={name}",
                replaceUrl: {
                  initial: "{id}",
                  url: "{name}"
                }
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
          component: "Input",
          componentAttribute: {
            id: "inputDetailsStandar",
            name: "inputDetailsStandar",
            label: "Input Details Standar",
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
          validation: "",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Id",
          typeColumnTable: "text",
          attributeColumnTable: "id",
          prefixColumnTable: "",
          allowSearch: true
        },
        {
          component: "Select",
          componentAttribute: {
            id: "selectDetailsStandar",
            name: "selectDetailsStandar",
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
          validation: "",
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
          component: "InputNominal",
          componentAttribute: {
            id: "inputDetailsNominal",
            name: "inputDetailsNominal",
            label: "Input Details Standar",
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
          validation: "",
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
          component: "FileUploader",
          componentAttribute: {
            id: "fileUploaderDetails",
            name: "fileUploaderDetails",
            label: "File Uploader Details",
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
          validation: "",
          showOnTable: false,
          mergingColumn: false,
          sortColumnTable: true,
          titleColumnTable: "Avatar",
          typeColumnTable: "text",
          attributeColumnTable: "avatar",
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
