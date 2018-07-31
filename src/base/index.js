import React, { Component, Fragment } from "react";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";

/* custom components */
import BaseTable from "./base-table";
import FormDialog from "../components/form/form-dialog";
import AlertDialog from "../components/etc/alert-dialog";
import CustomSnackbar from "../components/etc/custom-snackbar";

/* custom configuration */
import TableConf from "../constants/table-conf";

class CRUDGenerate extends Component {
  constructor(props) {
    super(props);

    /* this state spread to the children */
    this.state = {
      data: [],
      loading: false,
      snackbarInfo: {
        type: "error",
        message: "",
        visible: false
      },
      search: {},
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

    this.columnTable = this.getListColumnTable();
  }

  componentDidMount() {
    this.getDataDependOnConfig();
  }

  getListColumnTable = () => {
    const columns = [];
    const { fields } = this.props.options;
    for (let i = 0; i <= fields.length - 1; i++) {
      let itemColumn = fields[i];
      if (has(itemColumn, "showOnTable") && itemColumn.showOnTable === true) {
        columns.push(itemColumn);
      }
    }
    return columns;
  };

  getDataDependOnConfig = () => {
    /* check acl first */
    const { aclRules, aclId, options } = this.props;
    if (
      has(aclRules, aclId) &&
      has(aclRules[aclId], "view") &&
      aclRules[aclId].view
    ) {
      /* check user already using http to get data or not */
      if (
        has(options, "server") &&
        has(option.server, "http") &&
        has(option.server.http, "read") &&
        Object.keys(options.server.http.read).length > 0
      ) {
        this.getDataFromHTTPServer();
      }
    }
  };

  deleteDataDependOnConfig = (isBulk = false, params = {}) => () => {
    /* check acl first */
    const { aclRules, aclId, options } = this.props;
    if (
      has(aclRules, aclId) &&
      has(aclRules[aclId], "delete") &&
      aclRules[aclId].delete
    ) {
      /* check user already using http to get data or not */
      if (
        has(options, "server") &&
        has(option.server, "http") &&
        has(option.server.http, "delete") &&
        Object.keys(options.server.http.delete).length > 0
      ) {
        if (
          has(options.server.http.delete, "bulk") &&
          has(options.server.http.delete.bulk, "enable") &&
          options.server.http.delete.bulk.enable &&
          isBulk
        ) {
          this.doHTTPDeleteBulk(params);
        } else {
          this.doDeleteRowToHTTPServer(params);
        }
      }
    }
  };

  getHTTPUrl = (obj, limit, offset, page) => {
    /*
    Create url link from configuration in parent component also configuration of limitation per row and current page or offset.
    AVAILABLE :
    1. Limit
    2. Offset / Page

    NOT AVAILABLE :
    1. SORT
    2. SEARCH
    */
    let url = obj.url;
    if (has(obj, "query")) {
      url = `${obj.url}?`;
      if (has(obj.query, "limit")) {
        url += `&${obj.query.limit}=${limit}`;
      }

      if (has(obj.query, "offset")) {
        url += `&${obj.query.offset}=${offset};`;
      } else if (has(obj.query, "page")) {
        url += `&${obj.query.page}=${page};`;
      }
    }
    return url;
  };

  getDataFromHTTPServer = async (limit = null, offset = null, page = null) => {
    try {
      /*
      get data from url has been specify in the configuration of crud generation
      */
      if (has(this.props.options.server, "read")) {
        const { search, table } = this.state;
        const { read } = this.props.options.server;

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

        /* required data when get data from server */
        let configRead = has(read, "config") ? read.config : {};
        let methodRead = has(read, "method")
          ? read.method.toLowerCase()
          : "get";
        let urlRead = has(read, "url")
          ? this.getHTTPUrl(view, limit, offset, page)
          : "";

        /* start fetching data */
        await this.setLoadingProms(true);
        let { data } = await axios[methodRead](urlRead, configRead);

        /* finish fetch data and set data into state */
        this.setState({
          ...this.state,
          data,
          table: {
            ...this.state.table,
            limit,
            offset,
            page
          },
          loading: false
        });
      }
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

  setLoadingProms = (loading = false) =>
    new Promise(resolve => this.setState({ ...this.state, loading }, resolve));

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

    AVAILABLE :
    1. SORT by current state

    NO AVAILABLE :
    2. SORT to query link api
    */
    this.setState({
      ...this.state,
      data: this.orderingData(orderByNameColumn, sort),
      table: {
        ...this.state.table,
        orderBy: orderByNameColumn,
        sort
      }
    });
  };

  orderingData = (orderByNameColumn, sort) => {
    /* this sort will be categorize by two type data, there are number and text. So if text, using function localeCompare, meanwhile number using step curr - next */
    return this.state.data.sort((curr, next) => {
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
    let { isCheckAllItem, listChecked, data } = this.state;
    const { delete: dltConf } = this.props.option.server.http;

    if (!isCheckAllItem === true) {
      listChecked = data.map(item => item[dltConf.attributeName]);
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
      await this.setLoadingProms(true);

      const { delete: dltBulk } = this.props.options.server.http;
      const dltBulkConfig = has(dltBulk, "config") ? dltBulk.config : {};
      const dltBulkMethod = has(dltBulk.bulk, "method")
        ? dltBulk.bulk.method
        : "delete";
      const dltBulkUrl = has(dltBulk.bulk, "url") ? dltBulk.bulk.url : "";

      let isContinue = true; // flag for the continue this function or already taken by user
      let { listChecked } = this.state;

      /* before submit callback the data to user, if user want to modify */
      if (has(dltBulk.bulk, "callbackBeforeBulkDelete")) {
        const response = await dltBulk.bulk.callbackBeforeBulkDelete(
          listChecked, // data checked
          this.state.data // all data
        );
        /* return from every callback, have to same format like { isContinue, error, data } */
        if (has(response, "isContinue") && !response.isContinue) {
          if (has(response, "error") && response !== "") {
            throw new Error(response.error);
          }
          isContinue = false;
        } else if (has(response, "isContinue") && response.isContinue) {
          if (has(response, "data")) {
            listChecked = data;
          }
          isContinue = true;
        }
      }

      /* if user want to continue submit data using crud generate, just execute it */
      if (isContinue) {
        const result = await axios[dltBulkMethod](
          dltBulkUrl,
          listChecked,
          dltBulkConfig
        );

        if (has(dltBulk.bulk, "callbackAfterDeleteBulk")) {
          const response = await dltBulk.bulk.callbackAfterDeleteBulk(result);
        }
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
      await this.setLoadingProms(true);
      const { delete: dltRow } = this.props.options.server;

      const configDltRow = has(dltRow, "config") ? dltRow.config : {};
      const methodDltRow = has(dltRow, "method") ? dltRow.method : "delete";

      let urlDltRow = has(dltRow, "url") ? dltRow.url : "";
      if (has(urlDltRow, "replaceUrl")) {
        url = url.replace(dlt.replaceUrl, params.id);
      }

      /* perform delete action to one data */
      const resultDelete = await axios[methodDltRow](urlDltRow, configDltRow);
      if (!resultDelete) {
        throw new Error("Failed to delete the data");
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
      if (has(params, "bulkDelete") && params.bulkDelete) {
        this.deleteDataDependOnConfig(true, params);
      } else {
        this.deleteDataDependOnConfig(false, params);
      }
    } else if (dialogName === "form" && action == "submit") {
      this.doSubmitForm(params);
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

    this.configGetDataFromServer(null, offset, page);
  };

  /* doing limitation of how much row will be render */
  onChangeRowsPerPage = event => {
    this.configGetDataFromServer(event.target.value);
  };

  render() {
    return (
      <Fragment>
        {/* <FormDialog
          fields={fields}
          title={this.state.dialog.form.title}
          params={this.state.dialog.form.params}
          visible={this.state.dialog.form.visible}
          serverRequest={this.props.options.server}
          onClose={this.onDialogClose("form", "cancel")}
          onClickButtonClose={this.onDialogClose("form", "cancel")}
          onClickButtonSubmit={this.onDialogClose("form", "submit")}
        /> */}
        <BaseTable
          data={this.state.data}
          columns={this.columnTable}
          loading={this.state.loading}
          sort={this.state.table.sort}
          page={this.state.table.page}
          limit={this.state.table.limit}
          orderBy={this.state.table.orderBy}
          listChecked={this.state.listChecked}
          isCheckAllItem={this.state.isCheckAllItem}
          tableOptions={this.props.options.table}
          loadingOptions={this.props.options.loading}
          onCheckAllItem={this.onCheckAllItem}
          onClickCheckbox={this.onClickCheckbox}
          onClickBulkDelete={this.onClickBulkDelete}
          onClickDeleteRowItem={this.onClickDeleteRowItem}
          onChangePage={this.onChangePage}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
          onToggleFormDialog={this.onToggleFormDialog}
          onOrderingColumnTable={this.onOrderingColumnTable}
        />
        {/* <CustomSnackbar
          visible={this.state.snackbarInfo.visible}
          type={this.state.snackbarInfo.type}
          message={this.state.snackbarInfo.message}
          onClickSnackbar={this.resetSnackbarInfo}
        />
        <AlertDialog
          type={this.state.dialog.alert.type}
          title={this.state.dialog.alert.title}
          message={this.state.dialog.alert.message}
          visible={this.state.dialog.alert.visible}
          onClose={this.onDialogClose("alert", "cancel")}
          onAggree={this.onDialogClose("alert", "submit")}
          onDisaggree={this.onDialogClose("alert", "cancel")}
        /> */}
      </Fragment>
    );
  }
}

CRUDGenerate.propTypes = {
  aclId: PropTypes.string,
  aclRules: PropTypes.object,
  title: PropTypes.string,
  /* required only */
  options: PropTypes.object.isRequired,
  initialLimit: PropTypes.oneOf(TableConf.limitValue).isRequired
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
  initialLimit: 10
};

export default CRUDGenerate;
