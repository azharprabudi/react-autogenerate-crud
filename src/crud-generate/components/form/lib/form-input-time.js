import React, { PureComponent } from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import PropTypes from "prop-types";

class FormInputTime extends PureComponent {
  onChange = e => {
    this.props.onChangeValue(e.target.value);
  };

  render() {
    return (
      <TextField
        fullWidth
        type={"time"}
        margin={"normal"}
        id={this.props.id}
        name={this.props.name}
        InputProps={{
          readOnly: !this.props.editable
        }}
        style={this.props.style}
        label={this.props.label}
        error={this.props.error}
        value={this.props.value}
        onChange={this.onChange}
        disabled={!this.props.editable}
        helperText={this.props.helperText}
      />
    );
  }
}

FormInputTime.propTypes = {
  editable: PropTypes.bool,
  error: PropTypes.bool,
  style: PropTypes.any,
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChangeValue: PropTypes.func.isRequired
};

FormInputTime.defaultProps = {
  style: {},
  error: false,
  editable: true,
  helperText: ""
};

export default FormInputTime;
