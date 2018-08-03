import React, { PureComponent } from "react";

/* material ui modules */
import { withStyles } from "@material-ui/core/styles";
import { emphasize } from "@material-ui/core/styles/colorManipulator";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import Select from "react-select";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";

/* my modules */
import Option from "./etc/option";
import Control from "./etc/control";
import NoOptionsMessage from "./etc/no-options-message";
import Placeholder from "./etc/placeholder";
import SingleValue from "./etc/single-value";
import MultiValue from "./etc/multi-value";
import ValueContainer from "./etc/value-container";

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

class FormSelectAutoComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: has(props.extension, "data") ? props.extension.data : []
    };
  }

  componentDidMount() {
    if (has(this.props.extension, "customSource")) {
      this.getCustomSourceData();
    }
  }

  getCustomSourceData = async () => {
    try {
      const { extension } = this.props;
      const url = has(extension.customSource, "url")
        ? extension.customSource.url
        : "";
      const method = has(extension.customSource, "method")
        ? extension.customSource.method
        : "get";
      const config = has(extension.customSource, "config")
        ? extension.customSource.config
        : {};
      const data = await axios[method](url, config);
      if (!has(data, "data")) {
        throw new Error(data);
      }
      this.setState({
        data: data.data.map(data => ({
          label: data[extension.labelAttributeName],
          value: data[extension.idAttributeName]
        }))
      });
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  onChange = e => {
    this.props.onChange(e.value);
  };

  render() {
    const {
      id,
      name,
      value,
      style,
      error,
      label,
      disabled,
      readonly,
      helperText,
      classes
    } = this.props;
    console.log(value);
    return (
      <Select
        id={id}
        name={name}
        label={label}
        value={value}
        style={style}
        classes={classes}
        isDisabled={disabled}
        components={components}
        error={error}
        readonly={readonly}
        helperText={helperText}
        onChange={this.onChange}
        options={this.state.data}
        placeholder={"Choose one"}
      />
    );
  }
}

FormSelectAutoComplete.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  disabled: PropTypes.bool.isRequired,
  readonly: PropTypes.bool.isRequired,
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
  helperText: PropTypes.string.isRequired,
  /* non required */
  style: PropTypes.object
};

export default withStyles(styles)(FormSelectAutoComplete);
