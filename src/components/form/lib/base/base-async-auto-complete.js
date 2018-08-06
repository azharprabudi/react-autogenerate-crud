import React, { PureComponent } from "react";

/* material ui modules */
import { withStyles } from "@material-ui/core/styles";
import { emphasize } from "@material-ui/core/styles/colorManipulator";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import AsyncSelect from "react-select/lib/Async";

/* my modules */
import Option from "../etc/option";
import Control from "../etc/control";
import NoOptionsMessage from "../etc/no-options-message";
import Placeholder from "../etc/placeholder";
import SingleValue from "../etc/single-value";
import MultiValue from "../etc/multi-value";
import ValueContainer from "../etc/value-container";

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
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
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
  SingleValue,
  MultiValue,
  ValueContainer
};

class BaseAsyncAutoComplete extends PureComponent {
  state = {
    query: ""
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
      if (replaceUrl !== "") {
        url = url.replace(replaceUrl, value);
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
    this.props.onChange(value);
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
        value={this.props.value}
        isMulti={multi}
        defaultOptions
        placeholder={""}
        classes={classes}
        disabled={disabled}
        helperText={helperText}
        components={components}
        onChange={this.props.onChange}
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
  helperText: PropTypes.string.isRequired,
  /* non required */
  multi: PropTypes.bool,
  style: PropTypes.object
};

BaseAsyncAutoComplete.defaultProps = {
  multi: false
};

export default withStyles(styles)(BaseAsyncAutoComplete);
