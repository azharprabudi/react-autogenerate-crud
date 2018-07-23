import React, { Component, Fragment } from "react";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";

/* custom components */
import BaseSearch from "./base-search";
import BaseTable from "./base-table";

class CRUDGeneration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.existingData ? props.data : [],
      loading: false,
      error: {
        visible: false,
        message: ""
      },
      search: {},
      table: {
        sort: "asc",
        orderBy: ""
      }
    };

    this.limit = props.limit;
    this.offset = 0;
  }

  componentDidMount() {
    const { existingData, fetchOptions } = this.props;
    if (!existingData && fetchOptions.get.url !== "") {
      this.getDataFromServer();
    }
  }

  getDataFromServer = async () => {
    try {
      const { get } = this.props.fetchOptions;
      let configGetData = has(get, "config") ? get.config : {};
      await this.setLoadingProms(true);

      let { data } = await axios.get(get.url, configGetData);

      this.setState({
        ...this.state,
        data,
        loading: false
      });
    } catch (e) {
      await this.setLoadingProms();
    }
  };

  setLoadingProms = (loading = false) =>
    new Promise(resolve => this.setState({ ...this.state, loading }, resolve));

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
      </Fragment>
    );
  }
}

BaseTable.propTypes = {
  data: PropTypes.array,
  existingData: PropTypes.bool,
  fetchOptions: PropTypes.object,
  tableOptions: PropTypes.object,
  loadingOptions: PropTypes.object,
  useCheckbox: PropTypes.bool
};

BaseTable.defaultProps = {
  useCheckbox: false,
  existingData: false, // if want to use existing data, dont provide the fetch options
  fetchOptions: {
    get: {
      url: "", // this is the url from where the data want to get
      config: {} // the config you can see from the config axios at here https://github.com/axios/axios
    },
    add: {
      url: "", // this is the url from where the data want to add
      config: {} // the config you can see from the config axios at here https://github.com/axios/axios
    },
    edit: {
      url: "", // this is the url from where the data want to edit
      config: {}, // the config you can see from the config axios at here https://github.com/axios/axios
      replaceUrlParameter: {
        "{id}": "id"
      }
    },
    delete: {
      url: "", // this is the url from where the data want to delete
      config: {}, // the config you can see from the config axios at here https://github.com/axios/axios
      replaceUrlParameter: {
        "{id}": "id"
      }
    }
  },
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
