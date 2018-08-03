import React from "react";

/* material modules */
import MenuItem from "@material-ui/core/MenuItem";

const Option = props => (
  <MenuItem
    buttonRef={props.innerRef}
    selected={props.isFocused}
    component="div"
    style={{
      fontWeight: props.isSelected ? 500 : 400
    }}
    {...props.innerProps}
  >
    {props.children}
  </MenuItem>
);

export default Option;
