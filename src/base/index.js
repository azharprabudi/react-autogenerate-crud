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
        limit: props.limit
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
      checkAllList: false
    };
  }

  componentDidMount() {
    if (!this.props.existingData) {
      this.getDataFromServer();
    }
  }

  getUrlLink = (obj, limit, offset, page) => {
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

      // search
      // if (has(obj.query, 'page'))
    }

    return url;
  };

  getDataFromServer = async (limit = null, offset = null, page = null) => {
    try {
      const { search, table } = this.state;
      const { view } = this.props.options.server;

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
      let configGetData = has(view, "config") ? view.config : {};
      let methodGetData = has(view, "method")
        ? view.method.toLowerCase()
        : "get";
      let url = has(view, "url")
        ? this.getUrlLink(view, limit, offset, page)
        : "";

      /* start fetching data */
      await this.setLoadingProms(true);
      let { data } = await axios[methodGetData](url, configGetData);

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
    /* sort depend on orderByNameColumn clicked */
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

  /* setState checked item */
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

  onCheckAllItem = () => {
    let { checkAllList, listChecked, data } = this.state;
    if (!checkAllList === true) {
      listChecked = data.map(item => item[this.props.checkboxOptions.objName]);
    } else {
      listChecked = [];
    }

    this.setState({
      ...this.state,
      listChecked,
      checkAllList: !checkAllList
    });
  };

  /* when user want to delete bulk data, show alert dialog */
  onClickBulkDelete = () => {
    const { delete: dlt } = this.props.fetchOptions;
    let configDialog = { visible: true, title: "", message: "" };

    if (
      has(dlt, "bulk") &&
      has(dlt.bulk, "enable") &&
      dlt.bulk.enable === true
    ) {
      configDialog = {
        ...configDialog,
        title: "Confirmation",
        message: "Are you sure want to delete this data ?",
        type: "confirmation",
        params: { bulkDelete: true }
      };
    } else {
      configDialog = {
        ...configDialog,
        title: "Failed",
        message: "Please fill the configuration bulk delete options",
        type: "alert",
        params: {}
      };
    }

    if (this.state.listChecked.length < 1) {
      configDialog = {
        ...configDialog,
        title: "Failed",
        message: "No item checked",
        type: "alert",
        params: {}
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
  doDeleteBulkItem = async (params = {}) => {
    try {
      const { delete: dlt } = this.props.fetchOptions;
      const dltConfig = has(dlt, "config") ? dlt.config : {};
      await this.setLoadingProms(true);

      let isContinue = true; // this just flag if the user want to make a http request from the crud generator
      let { listChecked } = this.state;

      /* this condition used if user want to modif or just delete data using step they want */
      if (typeof this.props.callbackBeforeBulkDelete !== "undefined") {
        /*
        Every callbackBeforeBulkDelete have to wrap in promise function, and then have to return object like this {isContinue, error, data}. Which are the isContinue just flag if the user want to continue to delete the data using the method creator made, just set isContinue to true, but if not just set to false then if user using their method and then, there is a error message return the error to the object attribute error. The attribute data is the data already modifier by user 
        */
        const resultCallback = await this.props.callbackBeforeBulkDelete(
          listChecked,
          this.state.data
        );
        if (has(resultCallback, "isContinue") && !resultCallback.isContinue) {
          if (has(resultCallback, "error")) {
            throw new Error(resultCallback.error);
          }
          isContinue = false;
        } else if (
          has(resultCallback, "isContinue") &&
          resultCallback.isContinue
        ) {
          if (has(resultCallback, "data")) {
            listChecked = data;
          }
          isContinue = true;
        }
      }

      if (isContinue) {
        // axios.patch or put (url, data, config);
        const result = await axios[dlt.bulk.method](
          dlt.bulk.url,
          listChecked,
          dltConfig
        );
      }

      this.setState(
        {
          ...this.state,
          loading: false,
          listChecked: [],
          checkAllList: false,
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
  onDeleteRowButtonClick = id => {
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
  doDeleteRowButtonClick = async params => {
    try {
      // set loading to true
      await this.setLoadingProms(true);

      const { delete: dlt } = this.props.fetchOptions;
      if (!has(params, "id")) {
        throw new Error("The row doesnt have unique id");
      }

      const configDlt = has(dlt, "config") ? dlt.config : {};
      const methodDlt = has(dlt, "method") ? dlt.method : "delete";
      if (dlt.url === "") {
        throw new Error("The url delete not specified");
      }

      let { url } = dlt;
      if (has(dlt, "replaceUrl")) {
        url = url.replace(dlt.replaceUrl, params.id);
      }

      const resultDelete = await axios[methodDlt](url, configDlt);
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

  /* form alert dialog close */
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
        this.doDeleteBulkItem(params);
      } else if (has(params, "bulkDelete") && !params.bulkDelete) {
        this.doDeleteRowButtonClick(params);
      }
    } else if (dialogName === "form" && action == "submit") {
      this.doSubmitForm(params);
    }
  };

  /* pagination */
  onChangePage = (e, toValue) => {
    let { page, offset, limit } = this.state.table;
    if (toValue > page - 1) {
      page += 1;
      offset += limit;
    } else {
      page -= 1;
      offset -= limit;
    }

    this.getDataFromServer(null, offset, page);
  };

  /* limitation */
  onChangeRowsPerPage = event => {
    this.getDataFromServer(event.target.value);
  };

  render() {
    return (
      <Fragment>
        <FormDialog
          title={this.state.dialog.form.title}
          visible={this.state.dialog.form.visible}
          params={this.state.dialog.form.params}
          onClose={this.onDialogClose("form", "cancel")}
          onClickButtonnClose={this.onDialogClose("form", "cancel")}
          onClickButtonSubmit={this.onDialogClose("form", "submit")}
          addNewConfiguration={this.props.fetchOptions.addNew}
          editConfiguration={this.props.fetchOptions.edit}
          formOptions={this.props.formOptions}
        />
        <BaseTable
          title={this.props.title}
          data={this.state.data}
          loading={this.state.loading}
          sort={this.state.table.sort}
          page={this.state.table.page}
          limit={this.state.table.limit}
          orderBy={this.state.table.orderBy}
          listChecked={this.state.listChecked}
          checkAllList={this.state.checkAllList}
          tableOptions={this.props.tableOptions}
          loadingOptions={this.props.loadingOptions}
          checkboxOptions={this.props.checkboxOptions}
          onChangePage={this.onChangePage}
          onClickBulkDelete={this.onClickBulkDelete}
          onCheckAllItem={this.onCheckAllItem}
          onClickCheckbox={this.onClickCheckbox}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
          onOrderingColumnTable={this.onOrderingColumnTable}
          onToggleFormDialog={this.onToggleFormDialog}
          onDeleteRowButtonClick={this.onDeleteRowButtonClick}
        />
        <CustomSnackbar
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
        />
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
