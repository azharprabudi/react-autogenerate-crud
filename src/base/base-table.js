import React, { PureComponent, Fragment } from "react";

/* material ui */
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

/* etc modules */
import uniqueId from "lodash/uniqueId";
import isEqual from "lodash/isEqual";
import PropTypes from "prop-types";

/* my modules */
import BaseTableHeader from "./components/table-header";

const styles = theme => ({
  loading: {
    position: "absolute",
    left: "48%",
    top: 120
  }
});

class BaseTable extends PureComponent {
  onChangeOrderBy = orderByNameColumn => {
    let { sort, orderBy } = this.props;

    /* set sorting asc | desc and index orderBy */
    if (orderBy === orderByNameColumn && sort === "asc") {
      sort = "desc";
    } else {
      sort = "asc";
    }

    this.props.onChangeStateTable(orderByNameColumn, sort);
  };

  render() {
    const {
      data,
      classes,
      useCheckbox,
      tableOptions,
      loadingOptions,
      sort,
      orderBy,
      loading
    } = this.props;
    return (
      <Paper>
        <Table component="table">
          <BaseTableHeader
            sort={sort}
            orderBy={orderBy}
            useCheckbox={useCheckbox}
            onChangeOrderBy={this.onChangeOrderBy}
            columns={tableOptions.columns}
          />
          <TableBody component="tbody">
            {data.map(bodyItem => {
              return (
                <TableRow key={uniqueId(bodyItem.objName)} hover>
                  {tableOptions.columns.map(headItem => (
                    <TableCell key={bodyItem[headItem.objName]}>
                      {bodyItem[headItem.objName]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {loading === true && (
          <div className={classes.loading}>
            <CircularProgress
              color={loadingOptions.color}
              size={loadingOptions.size}
            />
          </div>
        )}
      </Paper>
    );
  }
}

BaseTable.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  tableOptions: PropTypes.object.isRequired,
  useCheckbox: PropTypes.bool.isRequired
};

export default withStyles(styles)(BaseTable);
