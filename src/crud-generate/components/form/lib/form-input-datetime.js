import React, { PureComponent } from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import PropTypes from "prop-types";

class FormInputDateTime extends PureComponent {
  onChange = e => {
    this.props.onChangeValue(e.target.value);
  };

  render() {
    return (
      <TextField
        fullWidth
        margin={"normal"}
        id={this.props.id}
        name={this.props.name}
        type={"datetime-local"}
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

FormInputDate.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  error: PropTypes.bool,
  style: PropTypes.object,
  helperText: PropTypes.string,
  onChangeValue: PropTypes.func.isRequired
};

FormInputDateTime.defaultProps = {
  style: {},
  error: false,
  editable: true,
  helperText: ""
};

export default FormInputDateTime;
