import React, { PureComponent } from "react";

/* material ui */
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";

/* etc modules */
import has from "lodash/has";
import axios from "axios";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import { FormHelperText } from "@material-ui/core";

class FormRadio extends PureComponent {
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
      const config = has(customSource, "config") ? customSource.config : {};

      /* fetch data from server */
      const data = await axios.get(url, config);
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
    const { id, name, value, style, extension, helperText, label } = this.props;
    return (
      <div style={{ marginTop: 18, marginBottom: 6 }}>
        <InputLabel>{label}</InputLabel>
        <RadioGroup
          id={id}
          name={name}
          style={style}
          value={value.toString()}
          onChange={this.onChange}
        >
          {this.state.data.map(item => (
            <FormControlLabel
              control={<Radio />}
              key={item[extension.idAttributeName]}
              value={item[extension.idAttributeName].toString()}
              label={item[extension.labelAttributeName]}
            />
          ))}
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </div>
    );
  }
}

FormRadio.propTypes = {
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
  style: PropTypes.object
};

export default FormRadio;
