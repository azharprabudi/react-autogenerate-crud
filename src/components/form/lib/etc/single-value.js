import React from "react";

/* material ui modules */
import Typography from "@material-ui/core/Typography";

const SingleValue = props => (
  <Typography
    className={props.selectProps.classes.singleValue}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

export default SingleValue;
