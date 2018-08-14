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
import isEqual from "lodash/isEqual";

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
  },
  test: {
    backgroundColor: "red"
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
      data: has(props.extension, "data")
        ? props.extension.data.map(item => ({
            value: item[props.extension.idAttributeName],
            label: item[props.extension.labelAttributeName]
          }))
        : []
    };

    this.initialize = true;
  }

  componentDidMount() {
    if (has(this.props.extension, "customSource") && !this.props.isEdit) {
      this.getCustomSourceData();
    }
  }

  componentDidUpdate(previousProps) {
    if (
      this.initialize &&
      this.props.isEdit &&
      isEqual(this.props.value, previousProps.value) === false
    ) {
      /* conditional when edit, user have to fetch data when the customSource attribute found in the configuration and vice cersa */
      if (has(this.props.extension, "customSource")) {
        this.getCustomSourceData();
      } else if (has(this.props.extension, "data")) {
        this.setSelectedState(this.state.data);
      }

      this.initialize = false;
    } else if (
      !this.props.isEdit &&
      !isEqual(this.props.value, previousProps.value)
    ) {
      if (this.props.multi) {
        this.setState({
          ...this.state,
          selected: this.props.value.map(item => {
            const selected = this.state.data.find(
              findItem => findItem.value === item
            );
            return {
              value: has(selected, "value") ? selected.value : "",
              label: has(selected, "label") ? selected.label : ""
            };
          })
        });
      } else {
        const selected = this.state.data.find(
          findItem => findItem.value === this.props.value
        );
        this.setState({
          ...this.state,
          selected: {
            value: has(selected, "value") ? selected.value : "",
            label: has(selected, "label") ? selected.label : ""
          }
        });
      }
    }
  }

  getCustomSourceData = async () => {
    try {
      const data = await this.doGetCustomSourceData();
      if (!this.props.isEdit) {
        this.setState({
          ...this.state,
          data
        });
      } else {
        this.setSelectedState(data);
      }
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  setSelectedState = data => {
    let selected = null;
    const { multi, value } = this.props;
    if (multi) {
      selected = value.map(item =>
        data.find(findItem => findItem.value == item)
      );
    } else {
      selected = data.find(findItem => findItem.value == value);
    }
    this.setState({
      data,
      selected
    });
  };

  doGetCustomSourceData = async () => {
    try {
      const { extension } = this.props;
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
      return data.data.map(item => ({
        value: item[extension.idAttributeName],
        label: item[extension.labelAttributeName]
      }));
    } catch (e) {
      return e;
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
        placeholder={""}
        helperText={helperText}
        onChange={this.onChange}
        options={this.state.data}
        value={this.state.selected}
        selectMenu={classes.test}
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
  isEdit: PropTypes.bool.isRequired,
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
