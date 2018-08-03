import React, { PureComponent } from "react";

/* material ui modules */
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

/* etc modules */
import has from "lodash/has";
import axios from "axios";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import { FormHelperText, InputLabel } from "@material-ui/core";

class FormCheckbox extends PureComponent {
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

  /* get data custom source from server */
  getCustomSourceData = async () => {
    try {
      const { customSource } = this.props.extension;
      const url = has(customSource, "url") ? customSource.url : "";
      const method = has(customSource, "method") ? customSource.method : "get";
      const config = has(customSource, "config") ? customSource.config : {};

      /* fetch data from server */
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
    let { value } = e.target;
    value = value.toString();
    if (this.props.value.indexOf(value) > -1) {
      this.props.onChange(this.props.value.filter(val => val !== value));
    } else {
      this.props.onChange([...this.props.value, value]);
    }
  };

  render() {
    const {
      label,
      extension,
      disabled,
      name,
      helperText,
      style,
      value
    } = this.props;
    return (
      <div style={{ marginTop: 18, marginBottom: 6 }}>
        <InputLabel>{label}</InputLabel>
        {this.state.data.map(item => (
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  name={name}
                  id={`id-${item[extension.idAttributeName]}`}
                  disabled={disabled}
                  onChange={this.onChange}
                  key={item[extension.idAttributeName]}
                  value={item[extension.idAttributeName].toString()}
                  checked={
                    value.indexOf(item[extension.idAttributeName].toString()) >
                    -1
                  }
                  style={style}
                />
              }
              label={item[extension.labelAttributeName]}
            />
          </div>
        ))}
        <FormHelperText>{helperText}</FormHelperText>
      </div>
    );
  }
}

FormCheckbox.propTypes = {
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

export default FormCheckbox;
