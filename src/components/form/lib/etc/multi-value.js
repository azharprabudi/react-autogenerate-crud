import React from "react";

/* material modules */
import Chip from "@material-ui/core/Chip";
import DeleteIcon from "@material-ui/icons/Delete";

/* etc modules */
import classNames from "classnames";

const MultiValue = props => (
  <Chip
    tabIndex={-1}
    label={props.children}
    className={classNames(props.selectProps.classes.chip, {
      [props.selectProps.classes.chipFocused]: props.isFocused
    })}
    onDelete={e => {
      console.log(e);
      props.removeProps.onMouseDown(event);
    }}
  />
);

export default MultiValue;
