import React, { Component, Fragment } from "react";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import isArray from "lodash/isArray";
import PropTypes from "prop-types";

/* custom components */
import BaseSearch from "./base-search";
import BaseTable from "./base-table";
import CustomSnackbar from "./components/custom-snackbar";

class CRUDGeneration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.existingData ? props.data : [],
      loading: false,
      snackbarInfo: {
        type: "error",
        message: "",
        visible: false
      },
      search: {},
      table: {
        sort: "asc",
        orderBy: ""
      }
    };

    this.page = 1;
    this.offset = 0;
    this.limit = props.limit;
  }

  componentDidMount() {
    if (!this.props.existingData) {
      this.getDataFromServer();
    }
  }

  getUrlLink = obj => {
    let url = obj.url;

    if (has(obj, "query")) {
      url = `${obj.url}?`;
      if (has(obj.query, "limit")) {
        url += `&${obj.query.limit}=${this.limit}`;
      }

      if (has(obj.query, "offset")) {
        url += `&${obj.query.offset}=${this.offset};`;
      }

      if (has(obj.query, "page")) {
        url += `&${obj.query.page}=${this.page};`;
      }

      // search
      // if (has(obj.query, 'page'))
    }

    return url;
  };

  getDataFromServer = async () => {
    try {
      const { view } = this.props.fetchOptions;
      const { search } = this.state;

      /* required data when get data from server */
      let configGetData = has(view, "config") ? view.config : {};
      let methodGetData = has(view, "method")
        ? view.method.toLowerCase()
        : "get";
      let url = has(view, "url") ? this.getUrlLink(view) : "";

      /* start fetching data */
      await this.setLoadingProms(true);
      let { data } = await axios[methodGetData](url, configGetData);

      /* finish fetch data and set data into state */
      this.setState({
        ...this.state,
        data,
        loading: false
      });
    } catch (e) {
      this.setState({
        ...this.state,
        loading: false,
        snackbarInfo: {
          type: "error",
          message: isArray(e) ? JSON.stringify(e) : e.toString(),
          visible: true
        }
      });
    }
  };

  setLoadingProms = (loading = false) =>
    new Promise(resolve => this.setState({ ...this.state, loading }, resolve));

  resetSnackbarInfo = () => {
    this.setState({
      ...this.state,
      snackbarInfo: {
        type: "error",
        message: "",
        visible: false
      }
    });
  };

  /* set state table */
  onChangeStateTable = (orderByNameColumn, sort) => {
    this.setState({
      ...this.state,
      data: this.orderingData(orderByNameColumn, sort),
      table: {
        orderBy: orderByNameColumn,
        sort
      }
    });
  };

  orderingData = (orderByNameColumn, sort) => {
    /* sort depend on orderByNameColumn clicked */
    return this.state.data.sort((curr, next) => {
      if (/^[0-9]/g.test(curr[orderByNameColumn])) {
        if (sort === "asc") {
          return curr[orderByNameColumn] - next[orderByNameColumn];
        }
        return next[orderByNameColumn] - curr[orderByNameColumn];
      } else {
        if (sort === "asc") {
          return curr[orderByNameColumn].localeCompare(next[orderByNameColumn]);
        }
        return next[orderByNameColumn].localeCompare(curr[orderByNameColumn]);
      }
    });
  };

  render() {
    const { classes, classNames } = this.props;
    return (
      <Fragment>
        <BaseSearch />
        <BaseTable
          data={this.state.data}
          loading={this.state.loading}
          sort={this.state.table.sort}
          orderBy={this.state.table.orderBy}
          tableOptions={this.props.tableOptions}
          loadingOptions={this.props.loadingOptions}
          onChangeStateTable={this.onChangeStateTable}
          useCheckbox={this.props.useCheckbox}
        />
        <CustomSnackbar
          visible={this.state.snackbarInfo.visible}
          type={this.state.snackbarInfo.type}
          message={this.state.snackbarInfo.message}
          onClickSnackbar={this.resetSnackbarInfo}
        />
      </Fragment>
    );
  }
}

BaseTable.propTypes = {
  data: PropTypes.array,
  limit: PropTypes.number,
  useCheckbox: PropTypes.bool,
  existingData: PropTypes.bool,
  fetchOptions: PropTypes.object,
  tableOptions: PropTypes.object,
  loadingOptions: PropTypes.object
};

BaseTable.defaultProps = {
  limit: 10,
  useCheckbox: false,
  existingData: false,
  fetchOptions: {},
  tableOptions: {
    btnAddNew: true,
    btnEdit: true,
    columns: [
      {
        title: "",
        objName: "",
        type: "" // number, text, image, rupiah, longtext
      }
    ]
  },
  loadingOptions: {
    color: "primary",
    size: 30
  }
};

export default CRUDGeneration;
