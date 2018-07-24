import React, { Component, Fragment } from "react";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import omit from "lodash/omit";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";

/* custom components */
import BaseTable from "./base-table";
import BaseSearch from "./base-search";
import CustomSnackbar from "../components/etc/custom-snackbar";

class CRUDGeneration extends Component {
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
        orderBy: ""
      },
      listChecked: [],
      checkAllList: false
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

  /* create url link, if the user want to refresh or search value, or do limitation */
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

  render() {
    const { classes, classNames } = this.props;
    return (
      <Fragment>
        <BaseSearch />
        <BaseTable
          title={this.props.title}
          data={this.state.data}
          loading={this.state.loading}
          sort={this.state.table.sort}
          orderBy={this.state.table.orderBy}
          listChecked={this.state.listChecked}
          onClickCheckbox={this.onClickCheckbox}
          tableOptions={this.props.tableOptions}
          loadingOptions={this.props.loadingOptions}
          onChangeStateTable={this.onChangeStateTable}
          checkboxOptions={this.props.checkboxOptions}
          checkAllList={this.state.checkAllList}
          onCheckAllItem={this.onCheckAllItem}
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

CRUDGeneration.propTypes = {
  limit: PropTypes.number,
  useCheckbox: PropTypes.bool,
  existingData: PropTypes.bool,
  fetchOptions: PropTypes.object,
  tableOptions: PropTypes.object,
  loadingOptions: PropTypes.object,
  checkboxOptions: PropTypes.object,
  /* required only */
  title: PropTypes.string.isRequired
};

CRUDGeneration.defaultProps = {
  limit: 10,
  fetchOptions: {},
  tableOptions: {},
  checkboxOptions: {
    enabled: false,
    objName: ""
  },
  loadingOptions: {
    color: "primary",
    size: 30
  }
};

export default CRUDGeneration;
