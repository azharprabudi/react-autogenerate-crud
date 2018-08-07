import React from "react";

/* material ui */
import Typography from "@material-ui/core/Typography";

const Placeholder = props => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.placeholder}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

export default Placeholder;
