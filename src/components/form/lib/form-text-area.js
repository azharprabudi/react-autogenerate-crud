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
      style
    } = this.props;
    return (
      <TextField
        fullWidth
        id={id}
        name={name}
        label={label}
        value={value}
        type={"text"}
        rows={rows}
        multiline={true}
        margin={"normal"}
        error={error}
        helperText={helperText}
        style={style}
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
  /* no required */
  style: PropTypes.object,
  value: PropTypes.string,
  rows: PropTypes.number,
  error: PropTypes.bool,
  helperText: PropTypes.string
};

FormTextArea.defaultProps = {
  value: "",
  rows: 4,
  error: false,
  helperText: "",
  style: {}
};

export default FormTextArea;
