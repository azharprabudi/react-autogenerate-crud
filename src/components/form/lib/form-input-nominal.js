import React, { PureComponent } from "react";

/* material ui modules */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

console.log(NumberFormat);

class FormInputNominal extends PureComponent {
  onChange = ({ value }) => {
    this.props.onChange(value);
  };

  render() {
    const { label, id, name, style, prefix, value } = this.props;
    return (
      <TextField
        id={id}
        fullWidth
        name={name}
        label={label}
        margin={"normal"}
        InputProps={{
          inputComponent: ({ inputRef, onChange, ...parentProps }) => {
            return (
              <NumberFormat
                {...parentProps}
                ref={inputRef}
                thousandSeparator={true}
                onValueChange={onChange}
              />
            );
          }
        }}
        value={value}
        style={style}
        prefix={prefix}
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
  prefix: PropTypes.string,
  style: PropTypes.object,
  helperText: PropTypes.string
};

FormInputNominal.defaultProps = {
  prefix: "",
  style: {},
  helperText: ""
};

export default FormInputNominal;
