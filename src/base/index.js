import React, { Component, Fragment } from "react";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";

/* custom components */
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
      search: {}
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

      /* create number in data */
      data = data.map((item, index) => ({ ...item, no: Number(index + 1) }));

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

  render() {
    return (
      <Fragment>
        <BaseTable
          data={this.state.data}
          startAt={this.offset}
          loading={this.state.loading}
          tableOptions={this.props.tableOptions}
          loadingOptions={this.props.loadingOptions}
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
  loadingOptions: PropTypes.object
};

BaseTable.defaultProps = {
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
  }
};

export default CRUDGeneration;
