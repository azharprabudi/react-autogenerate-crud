import React from "react";

/* material modules */
import Typography from "@material-ui/core/Typography";

const NoOptionsMessage = props => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

export default NoOptionsMessage;
