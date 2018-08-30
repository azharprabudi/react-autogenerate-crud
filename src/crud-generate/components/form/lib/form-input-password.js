import React, { PureComponent } from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = () => ({
  wrapperIconVisibility: {
    right: 10,
    zIndex: 10,
    position: "absolute"
  }
});

class FormInputPassword extends PureComponent {
  state = {
    showPassword: false
  };

  /* handler on change hide and show password */
  onTogglePassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  /* handler on change value */
  onChange = e => {
    this.props.onChangeValue(e.target.value);
  };

  render() {
    return (
      <TextField
        fullWidth
        margin={"normal"}
        type={"password"}
        id={this.props.id}
        name={this.props.name}
        onChange={this.onChange}
        value={this.props.value}
        InputProps={{
          readOnly: !this.props.editable,
          startAdornment: () => (
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
          )
        }}
        style={this.props.style}
        label={this.props.label}
        error={this.props.error}
        disabled={!this.props.editable}
        helperText={this.props.helperText}
      />
    );
  }
}

FormInput.propTypes = {
  error: PropTypes.bool,
  style: PropTypes.object,
  editable: PropTypes.bool,
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChangeValue: PropTypes.func.isRequired
};

FormInput.defaultProps = {
  style: {},
  error: false,
  editable: true,
  helperText: ""
};

export default withStyles(styles)(FormInput);
