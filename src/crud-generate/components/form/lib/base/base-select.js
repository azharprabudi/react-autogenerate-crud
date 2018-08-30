import React, { PureComponent } from "react";

/* material ui modules */
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";

class BaseSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: has(props.othersConf, "data")
        ? props.othersConf.data.map(item => ({
            id: item[props.othersConf.idAttributeName],
            label: item[props.othersConf.labelAttributeName]
          }))
        : []
    };
  }

  componentDidMount() {
    if (has(this.props.extension, "customSource")) {
      this.getCustomSourceData();
    }
  }

  /* get the data from server, if the user doest provide the data from props and choose the custom source */
  getCustomSourceData = async () => {
    try {
      const { othersConf } = this.props;

      const url = has(othersConf, "customSource")
        ? othersConf.customSource
        : "";
      const config = has(othersConf, "config") ? othersConf.config : {};
      const data = await axios.get(url, config);

      if (!has(data, "data")) {
        throw new Error(data);
      }

      this.setState({
        data: data.data.map(item => ({
          value: item[props.othersConf.idAttributeName],
          label: item[props.othersConf.labelAttributeName]
        }))
      });
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  /* on change listener */
  onChangeSelected = e => {
    let value = null;
    if (this.props.multi) {
      value = e.target.value.map(item =>
        this.state.data.find(({ id }) => id === item)
      );
    } else {
      value = this.state.data.find(({ id }) => id === e.target.value);
    }
    this.props.onChangeValue(value);
  };

  render() {
    return (
      <FormControl
        fullWidth
        margin={"normal"}
        error={this.props.error}
        disabled={!this.props.editable}
      >
        <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
        <Select
          style={this.props.style}
          value={
            this.props.multi
              ? this.props.value.id
              : this.props.value.map(({ id }) => id)
          }
          multiple={this.props.multi}
          onChange={this.onChangeSelected}
          input={
            <Input
              id={this.props.id}
              name={this.props.name}
              readOnly={!this.props.editable}
            />
          }
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250
              }
            }
          }}
          placeholder={""}
        >
          {this.state.data.map(({ id, label }) => (
            <MenuItem key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </Select>
        {this.props.error && (
          <FormHelperText>{this.props.helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }
}

BaseSelect.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.bool,
  editable: PropTypes.bool,
  value: PropTypes.any.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  othersConf: PropTypes.shape({
    data: PropTypes.array,
    customSource: PropTypes.string,
    config: PropTypes.object,
    idAttributeName: PropTypes.string.isRequired,
    labelAttributeName: PropTypes.string.isRequired
  }).isRequired,
  style: PropTypes.object,
  helperText: PropTypes.string
};

BaseSelect.defaultProps = {
  style: {},
  error: false,
  editable: true,
  helperText: ""
};

export default BaseSelect;
