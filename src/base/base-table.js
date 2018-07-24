import React, { PureComponent, Fragment } from "react";

/* material ui */
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import CircularProgress from "@material-ui/core/CircularProgress";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TablePagination from "@material-ui/core/TablePagination";

/* etc modules */
import PropTypes from "prop-types";
import classNames from "classnames";

/* my modules */
import BaseTableHeader from "../components/table/base-table-header";
import BaseTableBody from "../components/table/base-table-body";

const styles = theme => ({
  loading: {
    position: "absolute",
    left: "48%",
    top: 120
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  },
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight: {
    backgroundColor: theme.palette.primary.dark,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  },
  titleHightlight: {
    color: "white"
  },
  iconDelete: {
    color: "white"
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
      sort,
      data,
      title,
      classes,
      orderBy,
      loading,
      tableOptions,
      loadingOptions,
      checkboxOptions
    } = this.props;
    const isCheckItem = this.props.listChecked.length > 0;
    return (
      <Paper>
        <Toolbar
          className={classNames(classes.root, {
            [classes.highlight]: isCheckItem
          })}
        >
          <div className={classes.title}>
            <Typography
              variant="title"
              className={isCheckItem ? classes.titleHightlight : ""}
            >
              <b>{title}</b>
            </Typography>
          </div>
          <div className={classes.spacer} />
          <div className={classes.actions}>
            {isCheckItem && (
              <Tooltip title="Delete">
                <IconButton aria-label="Delete">
                  <DeleteIcon
                    className={classes.iconDelete}
                    onClick={this.props.onClickDelete}
                  />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </Toolbar>
        <div className={classes.tableWrapper}>
          <Table component="table" className={classes.table}>
            <BaseTableHeader
              sort={sort}
              title={title}
              orderBy={orderBy}
              columns={tableOptions.columns}
              checkbox={checkboxOptions.enable}
              onChangeOrderBy={this.onChangeOrderBy}
              checkAllList={this.props.checkAllList}
              onCheckAllItem={this.props.onCheckAllItem}
            />
            <BaseTableBody
              data={data}
              columns={tableOptions.columns}
              checkbox={checkboxOptions.enable}
              checkboxObjName={checkboxOptions.objName}
              listChecked={this.props.listChecked}
              onClickCheckbox={this.props.onClickCheckbox}
            />
          </Table>
        </div>
        <TablePagination
          page={this.props.page - 1}
          component="div"
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.props.onChangePage}
          rowsPerPageOptions={[]}
          rowsPerPage={this.props.limit}
          count={99999999999999999999999999999999}
          labelDisplayedRows={({ from, to, count }) => `${from} - ${to}`}
        />
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
  /* required */
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  sort: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  orderBy: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onChangePage: PropTypes.func.isRequired,
  tableOptions: PropTypes.object.isRequired,
  checkboxOptions: PropTypes.object.isRequired,
  loadingOptions: PropTypes.object.isRequired,
  listChecked: PropTypes.array.isRequired,
  onClickCheckbox: PropTypes.func.isRequired,
  checkAllList: PropTypes.bool.isRequired,
  onCheckAllItem: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired
};

export default withStyles(styles)(BaseTable);
