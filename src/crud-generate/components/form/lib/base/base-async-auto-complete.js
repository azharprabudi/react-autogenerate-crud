import React, { PureComponent } from "react";

/* material ui modules */
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import isEqual from "lodash/isEqual";
import AsyncSelect from "react-select/lib/Async";

/* my modules */
import Option from "../etc/option";
import Control from "../etc/control";
import Placeholder from "../etc/placeholder";
import ValueContainer from "../etc/value-container";
import NoOptionsMessage from "../etc/no-options-message";

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0,
    marginTop: 16,
    marginBottom: 8
  },
  valueContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center"
  },
  noOptionsMessage: {
    fontSize: 16,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  }
});

const components = {
  Option,
  Control,
  NoOptionsMessage,
  Placeholder,
  ValueContainer
};

class BaseAsyncAutoComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      selected: props.multi ? [] : { label: "", value: "" }
    };
    this.initialize = true;
  }

  componentDidUpdate(previousProps) {
    if (
      this.initialize &&
      this.props.isEdit &&
      isEqual(previousProps.value, this.props.value) === false
    ) {
      this.initialize = false;
      this.getValueFromProps(this.props.value);
    } else if (
      !this.props.isEdit &&
      !isEqual(this.props.value, previousProps.value) &&
      !isEqual(this.props.value, this.state.selected)
    ) {
      this.setState({
        ...this.state,
        selected: this.props.value
      });
    }
  }

  getValueFromProps = async value => {
    try {
      const { multi, extension } = this.props;
      let selected = null;
      if (multi) {
        let data = [];
        for (let i = 0; i < value.length; i++) {
          let result = await this.initialFetchToServer(value[i]);
          data.push({
            value: result[extension.idAttributeName],
            label: result[extension.labelAttributeName]
          });
        }
        selected = data;
      } else {
        let result = await this.initialFetchToServer(value);
        selected = {
          value: result[extension.idAttributeName],
          label: result[extension.labelAttributeName]
        };
      }
      this.setState({
        ...this.state,
        selected
      });
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  initialFetchToServer = async value => {
    try {
      const { extension } = this.props;

      let url = has(extension.customSource, "initialUrl")
        ? extension.customSource.initialUrl
        : "";
      const config = has(extension.customSource, "config")
        ? extension.customSource.config
        : {};

      /* check if there a query exist and then show it */
      const replaceUrl = has(extension.customSource, "replaceUrl")
        ? extension.customSource.replaceUrl
        : "";

      /* replace url if exist */
      if (has(replaceUrl, "initial")) {
        url = url.replace(replaceUrl.initial, value);
      }

      const result = await axios.get(url, config);
      if (!has(result, "data") || result.data.length < 1) {
        throw new Error(result);
      }
      return result.data[0];
    } catch (e) {
      return e;
    }
  };

  loadOptions = (value, callback) => {
    if (this.filt) {
      clearTimeout(this.filt);
    }
    this.filt = setTimeout(
      () => this.getCustomSourceData(value, callback),
      250
    );
  };

  getCustomSourceData = async (value, callback) => {
    try {
      const { extension } = this.props;
      let url = has(extension.customSource, "url")
        ? extension.customSource.url
        : "";
      const config = has(extension.customSource, "config")
        ? extension.customSource.config
        : {};

      /* check if there a query exist and then show it */
      const replaceUrl = has(extension.customSource, "replaceUrl")
        ? extension.customSource.replaceUrl
        : "";
      if (has(replaceUrl, "url")) {
        url = url.replace(replaceUrl.url, value);
      }

      const data = await axios.get(url, config);
      if (!has(data, "data")) {
        throw new Error(data);
      }

      /* select async have to return data */
      callback(
        data.data.map(data => ({
          label: data[extension.labelAttributeName],
          value: data[extension.idAttributeName]
        }))
      );
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  handleInputChange = query => {
    this.setState({
      query
    });
  };

  onChange = value => {
    this.setState({
      ...this.state,
      selected: value
    });
    /*
    just return id to the user
    */
    let returnValue = this.props.multi ? value.map(item => item.value) : value;
    this.props.onChange(returnValue);
  };

  render() {
    const {
      id,
      name,
      label,
      multi,
      error,
      disabled,
      helperText,
      classes
    } = this.props;
    return (
      <AsyncSelect
        id={id}
        name={name}
        label={label}
        error={error}
        cacheOptions
        isMulti={multi}
        defaultOptions
        classes={classes}
        disabled={disabled}
        placeholder={""}
        helperText={helperText}
        components={components}
        onChange={this.onChange}
        value={this.state.selected}
        loadOptions={this.loadOptions}
        onInputChange={this.handleInputChange}
      />
    );
  }
}

BaseAsyncAutoComplete.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  extension: PropTypes.shape({
    data: PropTypes.array,
    customSource: PropTypes.shape({
      url: PropTypes.string.isRequired,
      method: PropTypes.string,
      config: PropTypes.object
    }),
    idAttributeName: PropTypes.string.isRequired,
    labelAttributeName: PropTypes.string.isRequired
  }).isRequired,
  error: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  isEdit: PropTypes.bool.isRequired,
  helperText: PropTypes.string.isRequired,
  /* non required */
  multi: PropTypes.bool,
  style: PropTypes.object
};

BaseAsyncAutoComplete.defaultProps = {
  multi: false
};

export default withStyles(styles)(BaseAsyncAutoComplete);
