import React, { Component, Fragment } from "react";

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

const styles = theme => ({
  title: {
    fontWeight: "bold",
    color: "black",
    borderBottomWidth: 0,
    marginBottom: 8
  }
});

class CRUDGenerate extends Component {
  constructor(props) {
    super(props);

    /* get search field and search state */
    const { searchField, stateSearch } = this.getStateAndFieldSearch();

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
          visible: false,
          title: "",
          message: "",
          type: "",
          params: {}
        }
      },
      listChecked: [],
      isCheckAllItem: false
    };

    // destruct object
    const { server } = props;

    // list column table
    this.columnTable = this.getListColumnTable();

    this.deleteAttributeName = ""; // for identifier name attr, from data server
    if (has(props.server, "http") && has(props.server.http, "delete")) {
      this.deleteAttributeName = props.server.http.delete.attributeName;
    }

    this.editAttributeName = ""; // for identifier name attr, from data server
    if (has(props.server, "http") && has(props.server.http, "update")) {
      this.editAttributeName = props.server.http.update.attributeName;
      if (
        has(props.server.update, "get") &&
        has(props.server.update, "attributeName")
      ) {
        this.editAttributeName = props.server.update.attributeName;
      }
    }

    /* get setting configuration server */
    this.addConfigurationServer = {};
    this.editConfigurationServer = {};

    /* configuration sorting */
    this.confSortApi = { enable: false };

    if (has(server, "http") && Object.keys(server.http).length > 0) {
      if (has(server.http, "create")) {
        this.addConfigurationServer = { ...server.http.create };
      }
      if (has(server.http, "update")) {
        this.editConfigurationServer = { ...server.http.update };
      }
      if (has(server.http, "read")) {
        if (
          has(server.http.read, "query") &&
          has(server.http.read, "query") &&
          has(server.http.read.query, "sort")
        ) {
          this.confSortApi = {
            enable: true,
            url: server.http.read.query.sort
          };
        }
      }
    }

    /* get filter fileds */
    this.fields = props.fields.map(field => ({
      ...field,
      details: field.details.filter(
        item => !has(item, "mergingColumn") || item.mergingColumn === false
      )
    }));

    /* get list search field */
    this.searchField = searchField;
  }

  componentDidMount() {
    this.getDataDependOnConfig();
  }

  /* this function to get all fields who want to show at the table */
  getListColumnTable = () => {
    const columns = [];
    const { fields } = this.props;
    for (let i = 0; i <= fields.length - 1; i++) {
      if (fields[i].type === "standard") {
        for (let j = 0; j <= fields[i].details.length - 1; j++) {
          let field = fields[i].details[j];
          if (has(field, "showOnTable") && field.showOnTable) {
            columns.push(field);
          }
        }
      }
    }
    return columns;
  };

  getStateAndFieldSearch = () => {
    const searchField = [];
    const stateSearch = {};
    const { fields } = this.props;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].type === "standard") {
        for (let j = 0; j < fields[i].details.length; j++) {
          if (
            has(fields[i].details[j], "allowSearch") &&
            fields[i].details[j].allowSearch &&
            (!has(fields[i].details[j].mergingColumn) ||
              fields[i].details[j].mergingColumn === false) &&
            OptionsConf.componentNotAllowedSearch.indexOf(
              fields[i].details[j].component
            ) < 0 &&
            fields[i].details[j].componentAttribute.type !== "hidden"
          ) {
            searchField.push(fields[i].details[j]);
            stateSearch[fields[i].details[j].componentAttribute.name] =
              libDefaultvalue[fields[i].details[j].component];
          }
        }
      }
    }
    return { stateSearch, searchField };
  };

  /* fetching data depend on configuration using http / firebase / graphql */
  getDataDependOnConfig = (limit = null, offset = null, page = null) => {
    /* check acl first */
    const { aclRules, aclId, server } = this.props;
    if (
      has(aclRules, aclId) &&
      has(aclRules[aclId], "read") &&
      aclRules[aclId].read
    ) {
      /* check user already using http to get data or not */
      if (has(server, "http") && has(server.http, "read")) {
        this.getDataFromHTTPServer(limit, offset, page);
      }
    }
  };

  deleteDataDependOnConfig = (isBulk = false, params = {}) => {
    /* check acl first */
    const { aclRules, aclId, server } = this.props;
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
  };

  getHTTPUrl = (obj, limit, offset, page, search, sort) => {
    /*
    Create url link from configuration in parent component also configuration of limitation per row and current page or offset.
    */
    let url = obj.url;
    let isSearch = false;

    if (has(obj, "query")) {
      url = `${obj.url}?`;
      if (has(obj.query, "limit")) {
        url += `${obj.query.limit}=${limit}&`;
      }

      if (has(obj.query, "offset")) {
        url += `${obj.query.offset}=${offset}&`;
      } else if (has(obj.query, "page")) {
        url += `${obj.query.page}=${page}&`;
      }
    }

    if (Object.keys(search).length > 0) {
      if (url.indexOf("?") < 0) {
        url += `?`;
      }
      for (let [index, item] of Object.entries(search)) {
        if (
          (Array.isArray(item) && item.length > 0) ||
          (!Array.isArray(item) && item !== "")
        ) {
          url += `${index}=${item}&`;
          isSearch = true;
        }
      }

      if (sort !== null) {
        if (url.indexOf("?") < 0) {
          url += "?";
        }
        url += `&${sort}`;
      }
    }
    return { url, isSearch };
  };

  getDataFromHTTPServer = async (limit, offset, page) => {
    try {
      /*
      get data from url has been specify in the configuration of crud generation
      */
      const { read } = this.props.server.http;
      const { search, table } = this.state;

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
      if (this.confSortApi.enable && table.orderBy !== "") {
        sort = this.confSortApi.url;
        sort = sort.replace("{orderName}", table.orderBy);
        sort = sort.replace("{orderBy}", table.sort);
      }

      /* required data when get data from server */
      let configRead = has(read, "config") ? read.config : {};
      let { url: urlRead, isSearch } = this.getHTTPUrl(
        read,
        limit,
        offset,
        page,
        search,
        sort
      );

      if (isSearch) {
        if (has(read, "query") && has(read.query, "callbackBeforeSearch")) {
          urlRead = await read.query.callbackBeforeSearch(urlRead);
        }
      }

      /* start fetching data */
      await this.setLoadingProms("loading", true);
      let { data } = await axios.get(urlRead, configRead);

      /* finish fetch data and set data into state */
      this.setState({
        ...this.state,
        data: this.confSortApi.enable
          ? data
          : this.orderingData(data, table.orderBy, table.sort),
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
          ...this.state,
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
    new Promise(resolve =>
      this.setState({ ...this.state, [stateName]: loading }, resolve)
    );

  setSnackbarInfo = data => {
    if (this.state.snackbarInfo.visible !== true) {
      this.setState(
        {
          ...this.state,
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
        ...this.state,
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
    if (!this.confSortApi.enable) {
      this.setState({
        ...this.state,
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
          ...this.state,
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

  /* add item into state list check item */
  onClickCheckbox = id => {
    let { listChecked } = this.state;

    if (listChecked.indexOf(id) > -1) {
      listChecked = listChecked.filter(item => item !== id);
    } else {
      listChecked = [...listChecked, id];
    }

    this.setState({
      ...this.state,
      listChecked
    });
  };

  /* add all item in row, and push it into list check item */
  onCheckAllItem = () => {
    let attributeName = "";
    const { server } = this.props;
    let { isCheckAllItem, listChecked, data } = this.state;

    if (has(server, "http") && has(server.http, "delete")) {
      attributeName = server.http.delete.attributeName;
    }

    if (!isCheckAllItem === true) {
      listChecked = data.map(item => item[attributeName]);
    } else {
      listChecked = [];
    }

    this.setState({
      ...this.state,
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
  onDialogClose = (dialogName, action) => () => {
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
      title,
      classes,
      export: exportConf,
      additionalFieldsAtForm
    } = this.props;
    const {
      data,
      loading: isLoading,
      table: { sort, page, limit, orderBy },
      dialog: {
        form: { title: formTitle, params: formParams, visible: formVisible },
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
          {title}
        </Typography>
        <FormDialog
          fields={this.fields}
          title={`${upperFirst(formTitle)} ${upperFirst(title)}`}
          params={formParams}
          visible={formVisible}
          createConfigurationServer={this.addConfigurationServer}
          updateConfigurationServer={this.editConfigurationServer}
          onClose={this.onDialogClose("form", "cancel")}
          onClickButtonClose={this.onDialogClose("form", "cancel")}
          onClickButtonSubmit={this.doSubmitForm}
          loading={this.state.loadingForm}
          setErrorMessage={this.setSnackbarInfo}
          additionalFieldsAtForm={additionalFieldsAtForm}
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
          onClose={this.onDialogClose("alert", "cancel")}
          onAggree={this.onDialogClose("alert", "submit")}
          onDisaggree={this.onDialogClose("alert", "cancel")}
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
    http: PropTypes.shape({
      create: PropTypes.shape({
        url: PropTypes.string.isRequired,
        method: PropTypes.oneOf(OptionsConf.methodValue).isRequired,
        config: PropTypes.object,
        callbackBeforeCreate: PropTypes.func,
        callbackAfterCreate: PropTypes.func
      }),
      read: PropTypes.shape({
        url: PropTypes.string.isRequired,
        query: PropTypes.shape({
          limit: PropTypes.string,
          offset: PropTypes.string,
          sort: PropTypes.string,
          callbackBeforeSearch: PropTypes.func
        }),
        config: PropTypes.object
      }),
      update: PropTypes.shape({
        url: PropTypes.string.isRequired,
        get: PropTypes.shape({
          url: PropTypes.string.isRequired,
          config: PropTypes.object,
          replaceUrl: PropTypes.string,
          attributeName: PropTypes.string
        }),
        dataFromProps: PropTypes.bool.isRequired,
        config: PropTypes.object,
        method: PropTypes.oneOf(OptionsConf.methodValue).isRequired,
        replaceUrl: PropTypes.string,
        attributeName: PropTypes.string,
        callbackBeforeUpdate: PropTypes.func,
        callbackAfterUpdate: PropTypes.func
      }),
      delete: PropTypes.shape({
        url: PropTypes.string.isRequired,
        bulk: PropTypes.shape({
          url: PropTypes.string.isRequired,
          method: PropTypes.oneOf(OptionsConf.methodValue).isRequired,
          callbackBeforeBulkDelete: PropTypes.func,
          callbackAfterBulkDelete: PropTypes.func
        }),
        config: PropTypes.object,
        method: PropTypes.oneOf(OptionsConf.methodValue).isRequired,
        replaceUrl: PropTypes.string,
        attributeName: PropTypes.string,
        callbackBeforeDelete: PropTypes.func,
        callbackAfterDelete: PropTypes.func
      })
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
          attributeColumnTable: PropTypes.string.isRequired,
          allowSearch: PropTypes.bool,
          prefixColumnTable: PropTypes.string
        })
      )
    })
  ).isRequired,
  initialLimit: PropTypes.oneOf(OptionsConf.limitValue).isRequired,
  export: PropTypes.shape({
    url: PropTypes.string,
    config: PropTypes.object,
    type: PropTypes.oneOf(OptionsConf.typeExportValue).isRequired
  }),
  classes: PropTypes.object.isRequired,
  additionalFieldsAtForm: PropTypes.shape({
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
  additionalFieldsAtForm: {
    top: <div />,
    bottom: <div />
  }
};

export default withStyles(styles)(CRUDGenerate);
