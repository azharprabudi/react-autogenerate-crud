import React, { PureComponent } from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import PropTypes from "prop-types";

class FormTextArea extends PureComponent {
  onChange = e => {
    this.props.onChangeValue(e.target.value);
  };

  render() {
    const rows = has(this.props.othersConf, "rows")
      ? this.props.othersConf.rows
      : 4;
    return (
      <TextField
        fullWidth
        rows={rows}
        type={"text"}
        id={this.props.id}
        name={this.props.name}
        label={this.props.label}
        value={this.props.value}
        error={this.props.error}
        style={this.props.style}
        InputProps={{
          readOnly: !this.props.editable
        }}
        multiline={true}
        margin={"normal"}
        disabled={this.props.editable}
        helperText={this.props.helperText}
        onChange={this.onChange}
      />
    );
  }
}

FormTextArea.propTypes = {
  error: PropTypes.bool,
  style: PropTypes.object,
  editable: PropTypes.bool,
  othersConf: PropTypes.object,
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChangeValue: PropTypes.func.isRequired
};

FormTextArea.defaultProps = {
  style: {},
  error: false,
  editable: true,
  helperText: "",
  othersConf: {}
};

export default FormTextArea;
