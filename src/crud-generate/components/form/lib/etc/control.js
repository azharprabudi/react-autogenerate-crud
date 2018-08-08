import React from "react";

/* material ui */
import TextField from "@material-ui/core/TextField";

/* etc modules */
import has from "lodash/has";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

/* my modules */
import inputComponent from "./input-component";

const getRealValue = value => {
  if (isObject(value)) {
    let str = "";
    for (let [index, item] of Object.entries(value)) {
      str += item;
    }
    return str;
  } else if (isArray(value)) {
    return value.join("");
  } else {
    return value;
  }
};

const Control = props => {
  return (
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
      value={getRealValue(props.selectProps.value)}
    />
  );
};

export default Control;
