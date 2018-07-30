import React, { PureComponent } from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import PropTypes from "prop-types";

class FormInput extends PureComponent {
  onChange = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    const {
      id,
      name,
      value,
      type,
      disabled,
      label,
      helperText,
      readOnly,
      required,
      error,
      class: classes,
      style
    } = this.props;
    return (
      <TextField
        id={id}
        name={name}
        type={type}
        value={value}
        margin={"normal"}
        onChange={this.onChange}
        required={required}
        fullWidth={true}
        inputProps={{
          disabled,
          readOnly,
          classes,
          style
        }}
        label={label}
        error={error}
        helperText={helperText}
      />
    );
  }
}

FormInput.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  /* no required */
  error: PropTypes.bool,
  class: PropTypes.any,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  required: PropTypes.bool,
  type: PropTypes.oneOf(["text", "password", "number", "hidden"])
};

FormInput.defaultProps = {
  type: "text",
  required: false,
  helperText: "",
  style: {},
  disabled: false,
  class: "",
  error: true
};

export default FormInput;
