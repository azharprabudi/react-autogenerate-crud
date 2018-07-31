import React, { PureComponent } from "react";

/* material modules */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import MaskedInput from "react-text-mask";
import PropTypes from "prop-types";

class FormInputSeparator extends PureComponent {
  onChange = e => {
    console.log(e);
  };

  render() {
    const { id, name, error, value, style, helperText } = this.props;
    return (
      <TextField
        fullWidth
        id={id}
        name={name}
        label={label}
        error={error}
        value={value}
        style={style}
        margin={"normal"}
        InputProps={{
          inputComponent: ({ inputRef, ...others }) => (
            <MaskedInput
              {...others}
              ref={inputRef}
              mask={[
                "(",
                /[1-9]/,
                /\d/,
                /\d/,
                ")",
                " ",
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/
              ]}
              placeholderChar={"\u2000"}
              showMask
            />
          )
        }}
        helperText={helperText}
        onChange={this.onChange}
      />
    );
  }
}

export default FormInputSeparator;
