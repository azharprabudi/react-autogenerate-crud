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
  ValueContainer
};

class BaseAutoComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.multi ? [] : { label: "", value: "" },
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
      const { extension, isEdit, multi } = this.props;
      const url = has(extension.customSource, "url")
        ? extension.customSource.url
        : "";
      const config = has(extension.customSource, "config")
        ? extension.customSource.config
        : {};
      const data = await axios.get(url, config);
      if (!has(data, "data")) {
        throw new Error(data);
      }

      let selected = null;
      if (isEdit) {
        if (multi) {
          selected = this.props.value.map(item => {
            let result = data.data.find(
              findItem => findItem[extension.idAttributeName] === item
            );
            return {
              value: result[extension.idAttributeName],
              label: result[extension.labelAttributeName]
            };
          });
        } else {
          let result = data.data.find(
            findItem => findItem[extension.idAttributeName] === this.props.value
          );
          selected = {
            value: result[extension.idAttributeName],
            label: result[extension.labelAttributeName]
          };
        }
      }

      this.setState({
        selected,
        data: data.data.map(data => ({
          value: data[extension.idAttributeName],
          label: data[extension.labelAttributeName]
        }))
      });
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  onChange = value => {
    this.setState({
      ...this.state,
      selected: value
    });
    /* just return the id to the props   */
    let returnValue = this.props.multi
      ? value.map(({ value }) => value)
      : value.value;
    this.props.onChange(returnValue);
  };

  render() {
    const {
      id,
      name,
      value,
      label,
      multi,
      error,
      disabled,
      helperText,
      classes
    } = this.props;
    return (
      <Select
        id={id}
        name={name}
        label={label}
        error={error}
        style={styles}
        classes={classes}
        disabled={disabled}
        components={components}
        isMulti={multi}
        helperText={helperText}
        onChange={this.onChange}
        options={this.state.data}
        value={this.state.selected}
        placeholder={`Search your ${label} here`}
      />
    );
  }
}

BaseAutoComplete.propTypes = {
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

BaseAutoComplete.defaultProps = {
  multi: false
};

export default withStyles(styles)(BaseAutoComplete);
