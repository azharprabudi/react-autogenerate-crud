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
        data: data.data
      });
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  onChange = e => {
    this.props.onChange(e.target.value);
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
      extension,
      helperText
    } = this.props;
    return (
      <FormControl
        fullWidth
        error={error}
        margin={"normal"}
        disabled={disabled}
      >
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Select
          style={style}
          value={value}
          onChange={this.onChange}
          input={<Input id={id} name={name} readOnly={readonly} />}
        >
          {this.state.data.map(item => (
            <MenuItem
              key={item[extension.idAttributeName]}
              value={item[extension.idAttributeName]}
            >
              {item[extension.labelAttributeName]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
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

export default FormSelectAutoComplete;
