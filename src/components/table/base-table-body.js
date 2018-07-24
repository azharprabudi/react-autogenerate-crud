import React, { Component } from "react";

/* material modules */
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class BaseTableBody extends Component {
  render() {
    return (
      <TableBody component="tbody">
        {data.map(bodyItem => {
          return (
            <TableRow key={uniqueId(bodyItem.objName)} hover>
              {tableOptions.columns.map(headItem => (
                <TableCell key={bodyItem[headItem.objName]}>
                  <Typography>{bodyItem[headItem.objName]}</Typography>
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    );
  }
}

export default BaseTableBody;
