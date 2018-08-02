import React, { PureComponent } from "react";

/* material ui modules */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import PropTypes from "prop-types";

/* my modules */
import NumberFormatCustom from "../../etc/number-format-custom";

class FormInputNominal extends PureComponent {
  onChange = ({ value }) => {
    this.props.onChange(value);
  };

  render() {
    const { label, id, name, style, value, extension } = this.props;
    return (
      <TextField
        id={id}
        fullWidth
        name={name}
        label={label}
        margin={"normal"}
        InputProps={{
          inputComponent: NumberFormatCustom,
          inputProps: {
            prefix: "Rp."
          }
        }}
        value={value}
        style={style}
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
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
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
