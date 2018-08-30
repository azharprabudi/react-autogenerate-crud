import React, { PureComponent } from "react";

/* material ui */
import Typography from "@material-ui/core/Typography";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import brown from "@material-ui/core/colors/brown";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import upperFirst from "lodash/upperFirst";

/* custom components */
import BaseTable from "./base/base-table";
import BaseSearch from "./base/base-search";
import FormDialog from "./components/form/form-dialog";
import AlertDialog from "./components/etc/alert-dialog";
import CustomSnackbar from "./components/etc/custom-snackbar";

/* custom configuration */
import { libDefaultvalue } from "./components/form/lib";
import OptionsConf from "./constants/options-conf";
import ImportExportFile from "./helpers/import-export-file.js";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
      contrastText: "#fff"
    },
    secondary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
      contrastText: "#fff"
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700],
      contrastText: "#fff"
    },
    alternative1: {
      light: orange[300],
      main: orange[500],
      dark: orange[700],
      contrastText: "#fff"
    },
    alternative2: {
      light: green[300],
      main: green[500],
      dark: green[700],
      contrastText: "#fff"
    },
    table: {
      main: brown[500]
    }
  }
});

const styles = () => ({
  title: {
    fontWeight: "bold",
    color: "black",
    borderBottomWidth: 0,
    marginBottom: 8
  }
});

class CRUDGenerate extends PureComponent {
  constructor(props) {
    super(props);

    /* get initial data includes, search | state | columns */
    const {
      columns,
      formField,
      searchField,
      stateSearch
    } = this.getInitialData();

    /* this state spread to the children */
    this.state = {
      data: [],
      loading: false,
      loadingForm: false,
      snackbarInfo: {
        type: "error",
        message: "",
        visible: false
      },
      search: stateSearch,
      table: {
        sort: "asc",
        orderBy: "",
        page: 1,
        offset: 0,
        limit: props.initialLimit
      },
      dialog: {
        form: {
          title: "",
          message: "",
          type: "",
          visible: false,
          params: {}
        },
        alert: {
          title: "",
          message: "",
          type: "",
          visible: false,
          params: {}
        }
      },
      listChecked: [],
      isCheckAllItem: false
    };
    /* list column table */
    this.columnTable = columns;
    /* get filter fields */
    this.formField = formField;
    /* get list search field */
    this.searchField = searchField;
    /* get configuration server */
    this.getConfigurationServer(props.server);
  }

  componentDidMount() {
    setTimeout(() => {
      this.getDataDependOnConfig();
    }, 300);
  }

  getInitialData = () => {
    const columns = [];
    const formField = [];
    const searchField = [];
    const stateSearch = {};

    for (let i = 0; i < this.props.fields.length; i++) {
      if (this.props.fields[i].type === "standard") {
        let tmpFormField = { ...this.props.fields[i], details: [] };
        for (let j = 0; j < this.props.fields[i].details.length; j++) {
          /* take searching state & input field */
          if (
            has(this.props.fields[i].details[j], "allowSearch") &&
            this.props.fields[i].details[j].allowSearch &&
            (!has(this.props.fields[i].details[j].mergingColumn) ||
              this.props.fields[i].details[j].mergingColumn === false) &&
            OptionsConf.componentNotAllowedSearch.indexOf(
              this.props.fields[i].details[j].component
            ) < 0
          ) {
            searchField.push(this.props.fields[i].details[j]);
            stateSearch[
              this.props.fields[i].details[j].componentAttribute.name
            ] = libDefaultvalue[this.props.fields[i].details[j].component];
          }

          /* take column table field */
          if (
            has(this.props.fields[i].details[j], "showOnTable") &&
            this.props.fields[i].details[j].showOnTable
          ) {
            columns.push(this.props.fields);
          }

          /* form field */
          if (
            !has(this.props.fields[i].details[j], "mergingColumn") ||
            !this.props.fields[i].details["mergingColumn"]
          ) {
            tmpFormField.details.push(this.props.fields[i].details[j]);
          }
        }
        formField.push(tmpFormField);
      }
    }
    return { stateSearch, searchField, columns, formField };
  };

  getConfigurationServer = server => {
    let defaultConf = "http";
    if (has(server, "default")) {
      defaultConf = server.default;
    }
    /* this configuration will be used at all */
    this.configurationServer = {
      type: defaultConf,
      query: server[defaultConf].query,
      uniqueId: server[defaultConf].uniqueId,
      replaceUrlWithUniqueId: server[defaultConf].replaceUrlWithUniqueId || "",
      config: {
        read: {
          url: server[defaultConf].url,
          method: "get",
          config: server[defaultConf].config || {}
        },
        create: {
          url: server[defaultConf].url,
          method: "post",
          config: server[defaultConf].config || {}
        },
        update: {
          url: `${server.default.url}/{id}`,
          method: "patch",
          config: server[defaultConf].config || {}
        },
        delete: {
          url: `${server[defaultConf].url}/{id}`,
          method: "delete",
          config: server[defaultConf].config || {}
        },
        import: {
          url: `${server[defaultConf].url}/{id}`,
          method: "get",
          config: server[defaultConf].config || {}
        },
        export: {
          url: `${server[defaultConf].url}/{id}`,
          method: "post",
          config: server[defaultConf].config || {}
        },
        getDataUpdate: {
          url: `${server[defaultConf].url}/{id}`,
          method: "get",
          config: server[defaultConf].config || {}
        },
        bulkDelete: {
          url: `${server[defaultConf].url}`,
          method: "post",
          config: server[defaultConf].config || {}
        }
      },
      callbackBefore: server[defaultConf].callbackBefore,
      callbackAfter: server[defaultConf].callbackAfter
    };

    let i = 0;
    do {
      if (i == 0) {
        let status = [];
        if (
          has(server[defaultConf], "url") &&
          typeof server[defaultConf].url === "object"
        ) {
          status.push(true);
        }

        if (
          has(server[defaultConf], "method") &&
          typeof server[defaultConf].method === "object"
        ) {
          status.push(true);
        }

        if (
          has(server[defaultConf], "config") &&
          typeof server[defaultConf].config === "object"
        ) {
          status.push(true);
        }
        if (status.length === 0) break;
      }

      if (
        has(server[defaultConf], "url") &&
        typeof server[defaultConf].url === "object" &&
        has(server[defaultConf].url, OptionsConf.availableConfMethod[i])
      ) {
        this.configurationServer.config[
          OptionsConf.availableConfMethod[i]
        ].url = server[defaultConf].url[OptionsConf.availableConfMethod[i]];
      }

      if (
        has(server[defaultConf], "method") &&
        typeof server[defaultConf].method === "object" &&
        has(server[defaultConf].method, OptionsConf.availableConfMethod[i])
      ) {
        this.configurationServer.config[
          OptionsConf.availableConfMethod[i]
        ].method =
          server[defaultConf].method[OptionsConf.availableConfMethod[i]];
      }

      if (
        has(server[defaultConf], "config") &&
        typeof server[defaultConf].config === "object" &&
        has(server[defaultConf].config, OptionsConf.availableConfMethod[i])
      ) {
        this.configurationServer.config[
          OptionsConf.availableConfMethod[i]
        ].config =
          server[defaultConf].config[OptionsConf.availableConfMethod[i]];
      }
      i++;
    } while (i < OptionsConf.availableConfMethod.length);
  };

  getDataDependOnConfig = (limit = null, offset = null, page = null) => {
    const { aclRules, aclId } = this.props;
    if (
      has(aclRules, aclId) &&
      has(aclRules[aclId], "read") &&
      aclRules[aclId].read
    ) {
      if (this.configurationServer.type === "http") {
        this.getDataFromHTTPServer(limit, offset, page);
      }
    }
  };

  deleteDataDependOnConfig = (isBulk = false, params = {}) => {
    const { aclRules, aclId } = this.props;
    if (
      has(aclRules, aclId) &&
      has(aclRules[aclId], "delete") &&
      aclRules[aclId].delete
    ) {
      if (this.configurationServer.type === "http") {
        if (isBulk) {
          this.doDeleteBulkToHTTPServer(params);
        } else {
          this.doDeleteRowToHTTPServer(params);
        }
      }
    }
  };

  getHTTPUrl = (url, query, search, limit, offset, page, sort) => {
    url += `?`;
    let isSearch = false;

    // query limit
    if (has(query, "limit")) {
      url += `${query.limit}=${limit}&`;
    }
    // query offset
    if (has(query, "offset")) {
      url += `${query.offset}=${offset}&`;
    } else if (has(query, "page")) {
      url += `${query.page}=${page}&`;
    }
    // query search
    for (let [index, item] of Object.entries(search)) {
      if (
        (Array.isArray(item) && item.length > 0) ||
        (!Array.isArray(item) && item !== "")
      ) {
        url += `${index}=${item}&`;
        isSearch = true;
      }
    }
    // query sort
    if (sort !== null) {
      url += `${sort}&`;
    }

    return { url, isSearch };
  };

  getDataFromHTTPServer = async (limit, offset, page) => {
    try {
      /* get data from url has been specify in the configuration of crud generation */
      const { search, table } = this.state;
      const {
        query,
        config: { read },
        callbackBefore,
        callbackAfter
      } = this.configurationServer;

      /* if the parameter null, set to the current value at state */
      if (limit === null) {
        limit = table.limit;
      }
      if (offset === null) {
        offset = table.offset;
      }
      if (page === null) {
        page = table.page;
      }

      let sort = null;
      if (has(query, "sort") && table.orderBy !== "") {
        sort = query.sort;
        sort = sort.replace("{orderName}", table.orderBy);
        sort = sort.replace("{orderBy}", table.sort);
      }
      /* required data when get data from server */
      let { url: urlRead, isSearch } = this.getHTTPUrl(
        read.url,
        query,
        search,
        limit,
        offset,
        page,
        sort
      );

      let isContinue = true;
      if (isSearch) {
        if (typeof callbackBefore == "function") {
          const resultCb = await callbackBefore("read", { url: urlRead });
          if (has(resultCb, "isContinue")) {
            urlRead = resultCb.urlRead;
            isContinue = resultCb.isContinue;
            if (has(resultCb, "error") && resultCb.error !== "") {
              throw new Error(resultCb.error);
            }
          } else {
            isContinue = false;
            if (has(resultCb, "error") && resultCb.error !== "") {
              throw new Error(resultCb.error);
            }
          }
        }
      }

      let result = [];
      if (isContinue) {
        await this.setLoadingProms("loading", true);
        result = await axios[read.method](urlRead, read.config);
        if (!has(result, "data")) {
          throw new Error(result);
        }
        result = result.data;
      }

      if (typeof callbackAfter === "function") {
        await callbackAfter("read", { data: result.data });
      }

      /* finish fetch data and set data into state */
      this.setState({
        data: has(query, "sort")
          ? result
          : this.orderingData(result, table.orderBy, table.sort),
        table: {
          ...this.state.table,
          limit,
          offset,
          page
        },
        loading: false
      });
    } catch (e) {
      this.setState(
        {
          loading: false,
          snackbarInfo: {
            type: "error",
            message: isArray(e) ? JSON.stringify(e) : e.toString(),
            visible: true
          },
          table: {
            ...this.state.table,
            limit,
            offset,
            page
          }
        },
        () => setTimeout(this.resetSnackbarInfo, 3000)
      );
    }
  };

  setLoadingProms = (stateName, loading = false) =>
    new Promise(resolve => this.setState({ [stateName]: loading }, resolve));

  setSnackbarInfo = data => {
    if (this.state.snackbarInfo.visible !== true) {
      this.setState(
        {
          snackbarInfo: {
            ...data,
            visible: true
          }
        },
        () => setTimeout(this.resetSnackbarInfo, 3000)
      );
    }
  };

  resetSnackbarInfo = () => {
    if (this.state.snackbarInfo.visible === true) {
      this.setState({
        snackbarInfo: {
          ...this.state.snackbarInfo,
          message: "",
          visible: false
        }
      });
    }
  };

  onOrderingColumnTable = (orderByNameColumn, sort) => {
    /*
    This function will be called, if the user want to sort column depend on data in state, maybe for next time i want to make it sort data by query API link.
    */
    if (!has(this.configurationServer.query, "sort")) {
      this.setState({
        data: this.orderingData(this.state.data, orderByNameColumn, sort),
        table: {
          ...this.state.table,
          orderBy: orderByNameColumn,
          sort
        }
      });
    } else {
      this.setState(
        {
          table: {
            ...this.state.table,
            orderBy: orderByNameColumn,
            sort
          }
        },
        () =>
          this.getDataDependOnConfig(
            this.state.table.limit,
            this.state.table.offset,
            this.state.table.page
          )
      );
    }
  };

  /* this sort will be categorize by two type data, there are number and text. So if text, using function localeCompare, meanwhile number using step curr - next */
  orderingData = (data, orderByNameColumn, sort) => {
    /* just return it if there any sorting table */
    if (orderByNameColumn === "") {
      return data;
    }
    return data.sort((curr, next) => {
      let currOrderBy = null;
      let nextOrderBy = null;
      let removeSeparatorOrderBy = orderByNameColumn.split(".");

      if (removeSeparatorOrderBy.length > 1) {
        let tmpCurrOrderBy = curr;
        let tmpNextOrderBy = next;
        for (let i = 0; i < removeSeparatorOrderBy.length; i++) {
          tmpCurrOrderBy = tmpCurrOrderBy[removeSeparatorOrderBy[i]];
          tmpNextOrderBy = tmpNextOrderBy[removeSeparatorOrderBy[i]];
        }
        currOrderBy = tmpCurrOrderBy;
        nextOrderBy = tmpNextOrderBy;
      } else {
        currOrderBy = curr[orderByNameColumn];
        nextOrderBy = next[orderByNameColumn];
      }

      if (/\d/g.test(currOrderBy)) {
        if (sort === "asc") {
          return currOrderBy - nextOrderBy;
        }
        return nextOrderBy - currOrderBy;
      } else {
        if (sort === "asc") {
          return currOrderBy.localeCompare(nextOrderBy);
        }
        return nextOrderBy.localeCompare(currOrderBy);
      }
    });
  };

  onClickCheckbox = id => {
    let { listChecked } = this.state;

    /* check want to delete or add */
    if (listChecked.indexOf(id) > -1) {
      listChecked = listChecked.filter(item => item !== id);
    } else {
      listChecked = [...listChecked, id];
    }

    this.setState({
      listChecked
    });
  };

  onCheckAllItem = () => {
    let uniqueId = this.configurationServer.uniqueId;
    let { isCheckAllItem, listChecked, data } = this.state;

    if (!isCheckAllItem === true) {
      listChecked = data.map(item => item[uniqueId]);
    } else {
      listChecked = [];
    }

    this.setState({
      listChecked,
      isCheckAllItem: !isCheckAllItem
    });
  };

  /* when user want to delete bulk data, show alert dialog */
  onClickBulkDelete = () => {
    let configDialog = {
      visible: true,
      title: "Failed",
      message: "No item checked",
      type: "alert",
      params: {}
    };

    if (this.state.listChecked.length >= 1) {
      configDialog = {
        ...configDialog,
        title: "Confirmation",
        message: "Are you sure want to delete this data ?",
        type: "confirmation",
        params: { bulkDelete: true }
      };
    }

    this.setState({
      ...this.state,
      dialog: {
        ...this.state.dialog,
        alert: configDialog
      }
    });
  };

  /* submit to delete bulk data */
  doDeleteBulkToHTTPServer = async (params = {}) => {
    try {
      // set loading to true
      await this.setLoadingProms("loading", true);

      let dlt = {};
      const { server } = this.props;

      if (has(server, "http") && has(server.http, "delete")) {
        dlt = server.http.delete;
      }

      const dltBulkConfig = has(dlt, "config") ? dlt.config : {};
      const dltBulkMethod = has(dlt.bulk, "method") ? dlt.bulk.method : "post";
      const dltBulkUrl = has(dlt.bulk, "url") ? dlt.bulk.url : "";

      let isContinue = true; // flag for the continue this function or already taken by user
      let { listChecked, data } = this.state;

      /* before submit callback the data to user, if user want to modify */
      if (has(dlt.bulk, "callbackBeforeBulkDelete")) {
        const resultCb = await dlt.bulk.callbackBeforeBulkDelete({
          data: listChecked, // data checked
          dataExist: data // all data
        });
        /* return from every callback, have to same format like { isContinue, error, data } */
        if (has(resultCb, "error") && resultCb.error !== "") {
          throw new Error(resultCb.error);
        }
        if (!has(resultCb, "isContinue") || !resultCb.isContinue) {
          isContinue = false;
        } else if (has(resultCb, "isContinue") && resultCb.isContinue) {
          if (has(resultCb, "data")) {
            listChecked = resultCb.data;
          }
          isContinue = true;
        }
      }

      /* if user want to continue submit data using crud generate, just execute it */
      let result = null;
      if (isContinue) {
        result = await axios[dltBulkMethod](
          dltBulkUrl,
          listChecked,
          dltBulkConfig
        );
        if (!has(result, "data")) {
          throw new Error(result);
        }
        result = result.data;
      }

      if (has(dlt.bulk, "callbackAfterDeleteBulk")) {
        await dlt.bulk.callbackAfterDeleteBulk(result);
      }

      this.setState(
        {
          ...this.state,
          loading: false,
          listChecked: [],
          isCheckAllItem: false,
          dialog: {
            ...this.state.dialog,
            alert: {
              ...this.state.dialog.alert,
              visible: false
            }
          },
          snackbarInfo: {
            type: "success",
            message: "Success Delete Your Data",
            visible: true
          }
        },
        () => setTimeout(this.resetSnackbarInfo, 3000)
      );

      this.getDataDependOnConfig(
        this.state.table.limit,
        this.state.table.page,
        this.state.table.offset
      );
    } catch (e) {
      this.setState(
        {
          ...this.state,
          loading: false,
          snackbarInfo: {
            visible: true,
            type: "error",
            message: isArray(e) ? JSON.stringify(e) : e.toString()
          }
        },
        () => setTimeout(this.resetSnackbarInfo, 3000)
      );
    }
  };

  /* this method will be call when user want to delete single row item */
  onClickDeleteRowItem = id => {
    this.setState({
      ...this.state,
      dialog: {
        ...this.state.dialog,
        alert: {
          visible: true,
          type: "confirmation",
          title: "Confirmation",
          message: "Are you sure want to delete this data ?",
          params: { id, bulkDelete: false }
        }
      }
    });
  };

  /* do delete single row */
  doDeleteRowToHTTPServer = async params => {
    try {
      // set loading to true
      await this.setLoadingProms("loading", true);

      let dlt = {};
      const { server } = this.props;
      if (has(server, "http") && has(server.http, "delete")) {
        dlt = server.http.delete;
      }

      let urlDltRow = dlt.url;
      const configDltRow = has(dlt, "config") ? dlt.config : {};
      const methodDltRow = has(dlt, "method") ? dlt.method : "delete";

      if (has(dlt, "replaceUrl")) {
        urlDltRow = urlDltRow.replace(dlt.replaceUrl, params.id);
      }

      let isContinue = true; // just flag
      if (has(dlt, "callbackBeforeDelete")) {
        const resultCb = await dlt.callbackBeforeDelete({
          url: urlDltRow,
          data: params.id
        });
        if (has(resultCb.error) && resultCb.error !== "") {
          throw new Error(resultCb.error);
        }
        if (!has(resultCb, "isContinue") || !resultCb.isContinue) {
          isContinue = false;
        } else if (has(resultCb, "isContinue") && resultCb.isContinue) {
          if (has(resultCb, "data")) {
            urlDltRow = resultCb.data;
          }
          isContinue = true;
        }
      }

      /* perform is callback before update is to continue to this function */
      let result = null;
      if (isContinue) {
        result = await axios[methodDltRow](urlDltRow, configDltRow);
        /* perform delete action to one data */
        if (!has(result, "data")) {
          throw new Error(result);
        }
        result = result.data;
      }

      if (has(dlt, "callbackAfterDelete")) {
        await dlt.callbackAfterDelete(result.data);
      }

      this.setState(
        {
          ...this.state,
          loading: false,
          dialog: {
            ...this.state.dialog,
            alert: {
              ...this.state.dialog.alert,
              visible: false
            }
          },
          snackbarInfo: {
            visible: true,
            type: "success",
            message: "Success to delete the data"
          }
        },
        () => setTimeout(this.resetSnackbarInfo, 3000)
      );

      this.getDataDependOnConfig(
        this.state.table.limit,
        this.state.table.page,
        this.state.table.offset
      );
    } catch (e) {
      this.setState(
        {
          ...this.state,
          loading: false,
          snackbarInfo: {
            visible: true,
            type: "error",
            message: isArray(e) ? JSON.stringify(e) : e.toString()
          }
        },
        () => setTimeout(this.resetSnackbarInfo, 3000)
      );
    }
  };

  /* do submit form */
  doSubmitForm = async dataObj => {
    try {
      let resultStatus = false;
      const { aclRules, aclId } = this.props;
      if (
        !this.isEdit &&
        has(aclRules, aclId) &&
        has(aclRules[aclId], "create") &&
        aclRules[aclId].create
      ) {
        const result = await this.doAddForm(dataObj);
        if (result.error === true) {
          throw new Error(result.errorMessage);
        }
        resultStatus = true;
      } else if (
        this.isEdit &&
        has(aclRules, aclId) &&
        has(aclRules[aclId], "update") &&
        aclRules[aclId].update
      ) {
        return this.doUpdateForm(dataObj);
      } else {
        throw new Error("Doesn't have a permission for do that");
      }

      if (resultStatus) {
        this.setState(
          {
            ...this.state,
            loadingForm: false,
            snackbarInfo: {
              type: "success",
              message: "Success Add Your Data",
              visible: true
            },
            dialog: {
              ...this.state.dialog,
              form: {
                ...this.state.dialog.form,
                visible: false,
                params: {}
              }
            }
          },
          () => setTimeout(this.resetSnackbarInfo, 3000)
        );
      }
    } catch (e) {
      this.setSnackbarInfo({
        message: isArray(e) ? JSON.stringify(e) : e.toString(),
        type: "error"
      });
    }
  };

  /* add new data */
  doAddForm = async dataObj => {
    try {
      this.setLoadingProms("loadingForm", true);

      const { server } = this.props;
      let configuration = {};
      if (has(server, "http")) {
        if (has(server.http, "create")) {
          configuration = server.http.create;
        }
      }

      let resultCb = dataObj.data;
      let isContinue = true;
      if (has(configuration, "callbackBeforeCreate")) {
        resultCb = await configuration.callbackBeforeCreate(dataObj);
        if (has(resultCb, "error") && resultCb.error !== "") {
          throw new Error(resultCb.data);
        }
        if (has(resultCb, "isContinue") && resultCb.isContinue) {
          if (has(resultCb, "data")) {
            resultCb = resultCb.data;
          }
          isContinue = true;
        } else if (!has(resultCb.isContinue) || !resultCb.isContinue) {
          isContinue = false;
        }
      }

      let result = null;
      if (isContinue) {
        let url = has(configuration, "url") ? configuration.url : "";
        let method = has(configuration, "method")
          ? configuration.method
          : "post";
        let config = has(configuration, "config") ? configuration.config : {};

        result = await axios[method](url, resultCb, config);
        if (!has(result, "data")) {
          throw new Error(result);
        }
        result = result.data;
      }

      if (has(configuration, "callbackAfterCreate")) {
        await configuration.callbackAfterCreate(result);
      }

      return { error: false };
    } catch (e) {
      return { error: true, message: e };
    }
  };

  /* do edit */
  doUpdateForm = async data => {
    try {
      let configuration = {};
      const { server } = this.props;
      if (has(server, "http")) {
        if ((has(server.http), "update")) {
          configuration = server.http.update;
        }
      }

      let isContinue = true;
      let resultCb = data.data;
      if (has(configuration, "callbackBeforeUpdate")) {
        let resultCb = await configuration.callbackBeforeUpdate(data);

        if (has(resultCb, "error") && resultCb.error !== "") {
          throw new Error(resultCb.error);
        }

        if (!has(resultCb, "isContinue") || !resultCb.isContinue) {
          isContinue = false;
        } else if (has(resultCb, "isContinue") && resultCb.isContinue) {
          if ((resultCb, "data")) {
            resultCb = resultCb.data;
          }
          isContinue = true;
        }
      }

      let result = null;
      if (isContinue) {
        let url = has(configuration, "url") ? configuration.url : "";
        let method = has(configuration, "method")
          ? configuration.method
          : "patch";
        let config = has(configuration, "config") ? configuration.config : {};

        if (has(configuration, "replaceUrl")) {
          url = url.replace(configuration.replaceUrl, data.id);
        }

        result = axios[method](url, resultCb, config);
        if (!has(result, "data")) {
          throw new Error(result);
        }
        result = result.data;
      }

      if (has(configuration, "callbackAfterUpdate")) {
        await configuration.callbackAfterUpdate(result);
      }

      return { error: false };
    } catch (e) {
      return { error: true, message: e };
    }
  };

  /* form alert dialog open */
  onToggleFormDialog = (title = "", params = {}) => {
    this.setState({
      ...this.state,
      dialog: {
        ...this.state.dialog,
        form: {
          title,
          visible: true,
          params
        }
      }
    });
  };

  /* form submit alert and alert dialog close */
  onCloseDialog = (dialogName, action) => () => {
    let { params } = this.state.dialog[dialogName];
    if (this.state.dialog[dialogName].visible === true) {
      this.setState({
        ...this.state,
        dialog: {
          ...this.state.dialog,
          [dialogName]: {
            ...this.state.dialog[dialogName],
            visible: false,
            params: {}
          }
        }
      });
    }

    if (dialogName === "alert" && action === "submit") {
      const { aclRules, aclId, server } = this.props;
      let isBulk = has(params, "bulkDelete") && params.bulkDelete;
      /* check acl first */
      if (
        has(aclRules, aclId) &&
        has(aclRules[aclId], "delete") &&
        aclRules[aclId].delete
      ) {
        /* check user already using http to get data or not */
        if (has(server, "http") && has(server.http, "delete")) {
          if (has(server.http.delete, "bulk") && isBulk) {
            this.doDeleteBulkToHTTPServer(params);
          } else {
            this.doDeleteRowToHTTPServer(params);
          }
        }
      }
    }
  };

  /* doing pagination table */
  onChangePage = (e, toValue) => {
    let { page, offset, limit } = this.state.table;
    if (toValue > page - 1) {
      page += 1;
      offset += limit;
    } else {
      page -= 1;
      offset -= limit;
    }

    this.getDataDependOnConfig(null, offset, page);
  };

  /* doing limitation of how much row will be render */
  onChangeRowsPerPage = event => {
    this.getDataDependOnConfig(event.target.value);
  };

  /* listener for export whenever the button is clicked */
  onClickExport = type => async () => {
    try {
      /* initial first so can using at other method */
      let config = {};
      let urlExport = "";
      const { aclRules, aclId, server, export: exportConf } = this.props;
      if (has(aclRules[aclId], "export") && aclRules[aclId].export) {
        /* get url from export config, but if not exist take it from http request read */
        if (has(exportConf, "url") && exportConf.url !== "") {
          urlExport = exportConf.url;
          config =
            has(exportConf, "config") &&
            Object.keys(exportConf.config).length > 0
              ? exportConf.config
              : {};
        } else {
          if (has(server, "http") && has(server.http, "read")) {
            urlExport = server.http.read.url;
            config =
              has(server.http, "config") &&
              Object.keys(server.http.config).length > 0
                ? server.http.config
                : {};
          }
        }
      }
      this.mImportExportFile = new ImportExportFile();
      await this.mImportExportFile.generateFile(
        urlExport,
        config,
        this.columnTable,
        type
      );
    } catch (e) {
      this.setState({
        ...this.state,
        snackbarInfo: {
          visible: true,
          type: "error",
          message: isArray(e) ? JSON.stringify(e) : e.toString()
        }
      });
    }
  };

  /* on change search */
  onChangeSearch = (stateName, value) => {
    this.setState({
      ...this.state,
      search: {
        ...this.state.search,
        [stateName]: value
      }
    });
  };

  /* clear value from form */
  doClearFormValue = () => {
    let {
      search,
      table: { limit, offset, page }
    } = this.state;
    for (let [index, item] of Object.entries(search)) {
      if (Array.isArray(item)) {
        search[index] = [];
      } else {
        search[index] = "";
      }
    }
    this.setState(
      {
        ...this.state,
        search
      },
      () => this.getDataDependOnConfig(limit, offset, page)
    );
  };

  /* do search value */
  doSearchValue = () => {
    this.getDataDependOnConfig(
      this.state.table.limit,
      this.state.table.offset,
      this.state.table.page
    );
  };

  /* download example data */
  doDownloadImportdata = () => {
    const { aclRules, aclId } = this.props;
    try {
      if (
        !has(aclRules[aclId], "import") ||
        !aclRules[aclId].import ||
        !has(this.props, "import")
      ) {
        throw new Error("Doesnt have configuration import");
      }
      if (!has(this.props.import, "formatDataImport")) {
        throw new Error(
          "Doesnt have configuration formatDataImport inside import attribute"
        );
      }
      const mImportExportFile = new ImportExportFile();
      mImportExportFile.downloadExampleData(this.props.import.formatDataImport);
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  /* import data listener */
  doImportData = e => {
    try {
      const { aclRules, aclId } = this.props;
      if (
        !has(aclRules, aclId) ||
        !aclRules[aclId] ||
        !has(this.props, "import")
      ) {
        throw new Error("Doesnt have configuration import");
      }
      if (!has(this.props.import, "formatDataImport")) {
        throw new Error(
          "Doesnt have configuration formatDataImport inside import attribute"
        );
      }
      if (/.+\.(xlsx|.xls)$/.test(e.target.files[0].name) === false) {
        throw new Error("The extension files is not allowed");
      }
      const reader = new FileReader();
      reader.onload = this.onProgressImportData(
        this.props.import.formatDataImport
      );
      reader.onabort = () => alert("Abort upload file");
      reader.onerror = () => alert("Error upload file");
      reader.readAsArrayBuffer(e.target.files[0]);
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  onProgressImportData = formatDataImport => async e => {
    try {
      let { result } = e.target;
      result = new Uint8Array(result);
      const { import: importConf } = this.props;
      const mImportExportFile = new ImportExportFile();
      let resultDataImport = mImportExportFile.getDataFromFileUpload(
        result,
        formatDataImport
      );

      let isContinue = true;
      if (has(importConf, "callbackBeforeImport")) {
        let resultCb = await importConf.callbackBeforeImport(resultDataImport);
        if (has(resultCb, "isContinue")) {
          if (has(resultCb, "data")) {
            resultDataImport = resultCb.data;
          }
        } else {
          isContinue = false;
          if (has(resultCb, "error") && resultCb.error != "") {
            throw new Error(resultCb.error);
          }
        }
      }

      let resultRequest = null;
      if (isContinue) {
        let url = has(importConf, "url") ? importConf.url : "";
        let method = has(importConf, "method") ? importConf.method : "post";
        let config = has(importConf, "config") ? importConf.config : {};

        let resultRequest = await axios[method](url, resultDataImport, config);
        if (!has(resultRequest, "data")) {
          throw new Error(resultRequest);
        } else {
          resultRequest = resultRequest.data;
        }
      }

      if (has(importConf, "callbackAfterImport")) {
        await importConf.callbackAfterImport(resultRequest);
      }
    } catch (e) {
      this.setSnackbarInfo({
        type: "error",
        message: isArray(e) ? JSON.stringify(e) : e.toString()
      });
    }
  };

  render() {
    const {
      aclId,
      aclRules,
      table,
      loading,
      classes,
      export: exportConf
    } = this.props;
    const {
      data,
      loading: isLoading,
      table: { sort, page, limit, orderBy },
      dialog: {
        alert: {
          type: alertType,
          title: alertTitle,
          message: alertMessage,
          visible: alertVisible
        }
      },
      listChecked,
      isCheckAllItem,
      snackbarInfo: { visible, type, message }
    } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Typography className={classes.title} variant={"display1"}>
          {this.props.title}
        </Typography>
        <FormDialog
          fields={this.formField}
          params={this.state.dialog.form.params}
          visible={this.state.dialog.form.visible}
          configurationServer={{
            replaceUrlWithUniqueId: this.configurationServer
              .replaceUrlWithUniqueId,
            read: this.configurationServer.config.read,
            create: this.configurationServer.config.create,
            update: this.configurationServer.config.update,
            getDataUpdate: this.configurationServer.config.getDataUpdate
          }}
          loading={this.state.loadingForm}
          onClose={this.onCloseDialog("form", "cancel")}
          onClickButtonClose={this.onCloseDialog("form", "cancel")}
          onClickButtonSubmit={this.doSubmitForm}
          onSetErrorMessage={this.setSnackbarInfo}
          extensionComponentForm={this.props.extensionComponentForm}
          title={`${upperFirst(this.state.dialog.form.formTitle)} ${upperFirst(
            this.props.title
          )}`}
        />
        <BaseSearch
          fields={this.searchField}
          values={this.state.search}
          onChangeSearch={this.onChangeSearch}
          doSearchValue={this.doSearchValue}
          doClearFormValue={this.doClearFormValue}
        />
        <BaseTable
          data={data}
          sort={sort}
          page={page}
          limit={limit}
          table={table}
          orderBy={orderBy}
          loading={loading}
          isLoading={isLoading}
          listChecked={listChecked}
          columns={this.columnTable}
          aclSelected={aclRules[aclId]}
          isCheckAllItem={isCheckAllItem}
          dataFromProps={
            has(this.editConfigurationServer, "dataFromProps")
              ? this.editConfigurationServer.dataFromProps
              : false
          }
          onChangePage={this.onChangePage}
          onCheckAllItem={this.onCheckAllItem}
          onClickCheckbox={this.onClickCheckbox}
          onClickBulkDelete={this.onClickBulkDelete}
          onClickDeleteRowItem={this.onClickDeleteRowItem}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
          onToggleFormDialog={this.onToggleFormDialog}
          onOrderingColumnTable={this.onOrderingColumnTable}
          editAttributeName={this.editAttributeName}
          deleteAttributeName={this.deleteAttributeName}
          export={exportConf}
          onClickExportCsv={this.onClickExport("csv")}
          onClickExportExcel={this.onClickExport("excel")}
          doImportData={this.doImportData}
          doDownloadImportdata={this.doDownloadImportdata}
          useCheckbox={this.useCheckbox}
        />
        <CustomSnackbar
          type={type}
          visible={visible}
          message={message}
          onClickSnackbar={this.resetSnackbarInfo}
        />
        <AlertDialog
          type={alertType}
          title={alertTitle}
          message={alertMessage}
          visible={alertVisible}
          onClose={this.onCloseDialog("alert", "cancel")}
          onAggree={this.onCloseDialog("alert", "submit")}
          onDisaggree={this.onCloseDialog("alert", "cancel")}
        />
      </MuiThemeProvider>
    );
  }
}

CRUDGenerate.propTypes = {
  /* non required */
  aclId: PropTypes.string,
  title: PropTypes.string,
  aclRules: PropTypes.object,
  table: PropTypes.shape({
    row: PropTypes.shape({
      replaceUrl: PropTypes.string,
      attributeName: PropTypes.string,
      additionalButtons: PropTypes.object.isRequired
    }),
    buttonTopTable: PropTypes.object
  }),
  loading: PropTypes.shape({
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
  }),
  /* required only */
  server: PropTypes.shape({
    default: PropTypes.string.isRequired,
    http: PropTypes.shape({
      url: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          read: PropTypes.string.isRequired,
          create: PropTypes.string.isRequired,
          update: PropTypes.string.isRequired,
          delete: PropTypes.string.isRequired,
          bulkDelete: PropTypes.string,
          getUppdate: PropTypes.string
        })
      ]),
      replaceUrlWithUniqueId: PropTypes.string,
      uniqueId: PropTypes.string.isRequired,
      query: PropTypes.shape({
        limit: PropTypes.string.isRequired,
        page: PropTypes.string.isRequired,
        sort: PropTypes.string
      }).isRequired,
      method: PropTypes.shape({
        read: PropTypes.string,
        create: PropTypes.string,
        update: PropTypes.string,
        delete: PropTypes.string,
        bulkDelete: PropTypes.string,
        getUppdate: PropTypes.string
      }),
      config: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.shape({
          read: PropTypes.object,
          create: PropTypes.object,
          update: PropTypes.object,
          delete: PropTypes.object,
          bulkDelete: PropTypes.object,
          getUppdate: PropTypes.object
        })
      ]),
      callbackBefore: PropTypes.func,
      callbackAfter: PropTypes.func
    })
  }).isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      groupName: PropTypes.string.isRequired,
      type: PropTypes.oneOf(OptionsConf.typeFormValue).isRequired,
      details: PropTypes.arrayOf(
        PropTypes.shape({
          component: PropTypes.oneOf(OptionsConf.componentValue).isRequired,
          componentAttribute: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            style: PropTypes.object,
            extension: PropTypes.shape({
              customSource: PropTypes.shape({
                url: PropTypes.string.isRequired,
                config: PropTypes.object,
                initialUrl: PropTypes.string,
                replaceUrl: PropTypes.object
              }),
              imgConf: PropTypes.shape({
                minSize: PropTypes.number,
                maxSize: PropTypes.number,
                allowTypes: PropTypes.string
              }),
              editorConf: PropTypes.shape({
                img: PropTypes.shape({
                  uploadUrl: PropTypes.string.isRequired,
                  method: PropTypes.oneOf(OptionsConf.methodValue).isRequired,
                  config: PropTypes.object,
                  type: PropTypes.oneOf(OptionsConf.formatImage).isRequired
                })
              }),
              prefix: PropTypes.string,
              idAttributeName: PropTypes.string,
              labelAttributeName: PropTypes.string
            }),
            onAdd: PropTypes.shape({
              disabled: PropTypes.bool.isRequired,
              readonly: PropTypes.bool.isRequired
            }),
            onEdit: PropTypes.shape({
              disabled: PropTypes.bool.isRequired,
              readonly: PropTypes.bool.isRequired
            })
          }).isRequired,
          validation: PropTypes.string,
          callbackValidation: PropTypes.object,
          showOnTable: PropTypes.bool,
          mergingColumn: PropTypes.bool,
          sortColumnTable: PropTypes.bool,
          titleColumnTable: PropTypes.string.isRequired,
          typeColumnTable: PropTypes.oneOf(OptionsConf.typeColumnValue)
            .isRequired,
          uniqueId: PropTypes.string.isRequired,
          allowSearch: PropTypes.bool,
          prefixColumnTable: PropTypes.string
        })
      )
    })
  ).isRequired,
  initialLimit: PropTypes.oneOf(OptionsConf.limitValue),
  export: PropTypes.shape({
    url: PropTypes.string,
    config: PropTypes.object,
    type: PropTypes.oneOf(OptionsConf.typeExportValue).isRequired
  }),
  classes: PropTypes.object.isRequired,
  extensionComponentForm: PropTypes.shape({
    top: PropTypes.element,
    bottom: PropTypes.element
  }),
  import: PropTypes.shape({
    url: PropTypes.string,
    method: PropTypes.oneOf(OptionsConf.methodValue).isRequired,
    config: PropTypes.object,
    callbackBeforeImport: PropTypes.func,
    callbackAfterImport: PropTypes.func,
    formatDataImport: PropTypes.object.isRequired
  })
};

CRUDGenerate.defaultProps = {
  aclId: "*",
  title: "",
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
  loading: {
    size: 40,
    color: "#2196F3"
  },
  table: {
    buttonTopTable: {},
    row: {
      additionalButtons: {}
    }
  },
  export: {
    url: "",
    type: "csv"
  },
  extensionComponentForm: {
    top: <div />,
    bottom: <div />
  }
};

export default withStyles(styles)(CRUDGenerate);
