import React from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import inputComponent from "./input-component";

const Control = props => {
  console.log(props);
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          ref: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
    />
  );
};

export default Control;
