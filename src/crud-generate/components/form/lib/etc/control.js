import React from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import inputComponent from "./input-component";

const Control = props => (
  <TextField
    fullWidth
    margin={"normal"}
    error={props.selectProps.eror}
    label={props.selectProps.label}
    disabled={props.selectProps.disabled}
    helperText={props.selectProps.helperText}
    InputProps={{
      inputComponent,
      inputProps: {
        className: props.selectProps.classes.input,
        ref: props.innerRef,
        children: props.children,
        readOnly: props.selectProps.readonly,
        ...props.innerProps
      }
    }}
  />
);

export default Control;
