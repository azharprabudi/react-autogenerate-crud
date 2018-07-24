import React, { Component } from "react";

/* material modules */
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";

/* etc modules */
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";

class BaseTableBody extends Component {
  onClickCheckbox = () => () => {
    alert(1);
    this.props.onClickCheckbox();
  };

  render() {
    const { data, columns, useCheckbox } = this.props;
    return (
      <TableBody component="tbody">
        {data.map(itemBody => {
          return (
            <TableRow key={uniqueId(itemBody.objName)} hover>
              {useCheckbox && (
                <TableCell padding={"checkbox"}>
                  <Checkbox checked={true} onClick={this.onClickCheckbox()} />
                </TableCell>
              )}
              {columns.map(itemColumn => (
                <TableCell key={itemBody[itemColumn.objName]}>
                  <Typography>{itemBody[itemColumn.objName]}</Typography>
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    );
  }
}

BaseTableBody.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  useCheckbox: PropTypes.bool.isRequired,
  onClickCheckbox: PropTypes.func
};

BaseTableBody.defaultProps = {
  onClickCheckbox: () => {}
};

export default BaseTableBody;
