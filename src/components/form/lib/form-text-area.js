import React, { PureComponent } from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import PropTypes from "prop-types";

class FormTextArea extends PureComponent {
  /* handler on change value */
  onChange = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    const {
      label,
      value,
      rows,
      error,
      helperText,
      name,
      id,
      style,
      disabled,
      extension,
      readonly
    } = this.props;
    return (
      <TextField
        fullWidth
        id={id}
        rows={rows}
        name={name}
        label={label}
        value={value}
        error={error}
        style={style}
        type={"text"}
        InputProps={{
          ...extension,
          readOnly: readonly
        }}
        multiline={true}
        margin={"normal"}
        disabled={disabled}
        helperText={helperText}
        onChange={this.onChange}
      />
    );
  }
}

FormTextArea.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  readonly: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  extension: PropTypes.object.isRequired,
  value: PropTypes.any.isRequired,
  error: PropTypes.bool.isRequired,
  helperText: PropTypes.string.isRequired,
  /* no required */
  style: PropTypes.object,
  rows: PropTypes.number
};

FormTextArea.defaultProps = {
  rows: 4,
  style: {}
};

export default FormTextArea;
