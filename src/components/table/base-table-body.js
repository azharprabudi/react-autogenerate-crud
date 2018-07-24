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
  onClickCheckbox = id => () => {
    this.props.onClickCheckbox(id);
  };

  render() {
    const {
      data,
      columns,
      checkbox,
      checkboxObjName,
      listChecked
    } = this.props;
    return (
      <TableBody component="tbody">
        {data.map(itemBody => {
          return (
            <TableRow key={uniqueId(itemBody.objName)} hover>
              {checkbox && (
                <TableCell padding={"checkbox"}>
                  <Checkbox
                    checked={
                      listChecked.indexOf(itemBody[checkboxObjName]) > -1
                    }
                    color={"primary"}
                    onClick={this.onClickCheckbox(itemBody[checkboxObjName])}
                  />
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
  checkbox: PropTypes.bool.isRequired,
  listChecked: PropTypes.array.isRequired,
  onClickCheckbox: PropTypes.func.isRequired,
  checkboxObjName: PropTypes.string.isRequired
};

BaseTableBody.defaultProps = {
  onClickCheckbox: () => {}
};

export default BaseTableBody;
