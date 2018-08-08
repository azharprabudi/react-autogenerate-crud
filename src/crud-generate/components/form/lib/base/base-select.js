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

class FormSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: has(props.extension, "data")
        ? props.extension.data.map(item => ({
            value: item[props.extension.idAttributeName],
            label: item[props.extension.labelAttributeName]
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
      const { isEdit, extension, value } = this.props;
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

      this.setState({
        data: data.data.map(item => ({
          value: item[extension.idAttributeName],
          label: item[extension.labelAttributeName]
        }))
      });
    } catch (e) {
      alert(isArray(e) ? JSON.stringify(e) : e.toString());
    }
  };

  /* on change listener */
  onChangeSelected = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    const {
      id,
      name,
      style,
      error,
      label,
      disabled,
      readonly,
      multi,
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
          multiple={multi}
          value={this.props.value}
          onChange={this.onChangeSelected}
          input={<Input id={id} name={name} readOnly={readonly} />}
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
          {this.state.data.map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }
}

FormSelect.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  isEdit: PropTypes.bool.isRequired,
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
  style: PropTypes.object,
  multi: PropTypes.bool
};

FormSelect.defaultProps = {
  style: {},
  multi: false
};

export default FormSelect;
