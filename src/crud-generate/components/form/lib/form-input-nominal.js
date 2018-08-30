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
    this.props.onChangeValue(value);
  };

  render() {
    return (
      <TextField
        fullWidth
        margin={"normal"}
        id={this.props.id}
        name={this.props.name}
        label={this.props.label}
        InputProps={{
          inputComponent: NumberFormatCustom,
          inputProps: {
            prefix:
              has(this.props, "othersConf") &&
              has(this.props.othersConf, "prefix")
                ? this.props.othersConf.prefix
                : ""
          },
          readOnly: !this.props.editable
        }}
        value={this.props.value}
        style={this.props.style}
        error={this.props.error}
        onChange={this.onChange}
        disabled={!this.props.editable}
        helperText={this.props.helperText}
      />
    );
  }
}

FormInputNominal.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  othersConf: PropTypes.shape({
    prefix: PropTypes.string.isRequired
  }),
  onChangeValue: PropTypes.func.isRequired,
  error: PropTypes.bool,
  style: PropTypes.object,
  editable: PropTypes.bool,
  helperText: PropTypes.string
};

FormInputNominal.defaultProps = {
  style: {},
  error: false,
  helperText: "",
  editable: true
};

export default FormInputNominal;
