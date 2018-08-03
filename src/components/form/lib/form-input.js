import React, { PureComponent } from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";

const styles = theme => ({
  wrapperIconVisibility: {
    right: 10,
    zIndex: 999,
    position: "absolute"
  }
});

class FormInput extends PureComponent {
  state = {
    showPassword: false
  };

  /* handler on change hide and show password */
  onTogglePassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  /* add adornment here */
  getContentStartAdornment = () => {
    if (has(this.props, "inputProps")) {
      if (this.props.inputProps.adornmentType === "text") {
        return (
          <InputAdornment position={this.props.inputProps.adornmentPosition}>
            {this.props.inputProps.adornmentType}
          </InputAdornment>
        );
      } else if (this.props.inputProps.adornmentType === "password") {
        return (
          <InputAdornment
            position="end"
            className={this.props.classes.wrapperIconVisibility}
          >
            <IconButton
              aria-label="Toggle password visibility"
              onClick={this.onTogglePassword}
            >
              {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        );
      }
    }
    return null;
  };

  /* handler on change value */
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
      readonly,
      required,
      error,
      style,
      extension
    } = this.props;
    return (
      <TextField
        id={id}
        name={name}
        type={this.state.showPassword ? "text" : type}
        value={value}
        margin={"normal"}
        onChange={this.onChange}
        required={required}
        fullWidth={true}
        InputProps={{
          style,
          readOnly: readonly,
          startAdornment: this.getContentStartAdornment(),
          ...extension
        }}
        label={label}
        error={error}
        disabled={disabled}
        helperText={helperText}
      />
    );
  }
}

FormInput.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  readonly: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  extension: PropTypes.object.isRequired,
  /* no required */
  error: PropTypes.bool,
  class: PropTypes.any,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  type: PropTypes.oneOf(["text", "password", "number", "hidden"]),
  inputProps: PropTypes.object
};

FormInput.defaultProps = {
  type: "text",
  required: false,
  helperText: "",
  style: {},
  disabled: false,
  class: "",
  error: true,
  inputProps: {}
};

export default withStyles(styles)(FormInput);
