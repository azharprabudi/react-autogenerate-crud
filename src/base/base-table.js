import React, { PureComponent, Fragment } from "react";

/* material ui */
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import CircularProgress from "@material-ui/core/CircularProgress";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

/* etc modules */
import PropTypes from "prop-types";

/* my modules */
import BaseTableHeader from "../components/table/base-table-header";
import BaseTableBody from "../components/table/base-table-body";

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
    return (
      <Paper>
        <Toolbar>
          <Typography variant="title">{title}</Typography>
        </Toolbar>
        <Table component="table">
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
  sort: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  orderBy: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  tableOptions: PropTypes.object.isRequired,
  checkboxOptions: PropTypes.object.isRequired,
  loadingOptions: PropTypes.object.isRequired,
  listChecked: PropTypes.array.isRequired,
  onClickCheckbox: PropTypes.func.isRequired,
  checkAllList: PropTypes.bool.isRequired,
  onCheckAllItem: PropTypes.func.isRequired
};

export default withStyles(styles)(BaseTable);
