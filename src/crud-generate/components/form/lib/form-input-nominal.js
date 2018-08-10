import React, { PureComponent } from "react";

/* material ui modules */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";

/* my modules */
import NumberFormatCustom from "../../etc/number-format-custom";

class FormInputNominal extends PureComponent {
  onChange = ({ value }) => {
    this.props.onChange(value);
  };

  render() {
    const {
      label,
      id,
      name,
      style,
      value,
      extension,
      readonly,
      disabled,
      error,
      helperText
    } = this.props;
    return (
      <TextField
        id={id}
        name={name}
        label={label}
        fullWidth
        margin={"normal"}
        InputProps={{
          inputComponent: NumberFormatCustom,
          inputProps: {
            prefix: has(extension, "prefix") ? extension.prefix : ""
          },
          readOnly: readonly
        }}
        value={value}
        style={style}
        disabled={disabled}
        error={error}
        helperText={helperText}
        onChange={this.onChange}
      />
    );
  }
}

FormInputNominal.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  isEdit: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  readonly: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  extension: PropTypes.object.isRequired,
  /* not required */
  error: PropTypes.bool,
  style: PropTypes.object,
  helperText: PropTypes.string
};

FormInputNominal.defaultProps = {
  style: {},
  helperText: ""
};

export default FormInputNominal;
