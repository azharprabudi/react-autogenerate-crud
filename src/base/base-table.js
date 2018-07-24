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
      useCheckbox,
      tableOptions,
      loadingOptions
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
            useCheckbox={useCheckbox}
            columns={tableOptions.columns}
            onChangeOrderBy={this.onChangeOrderBy}
          />
          <BaseTableBody
            data={data}
            useCheckbox={useCheckbox}
            columns={tableOptions.columns}
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
  useCheckbox: PropTypes.bool.isRequired,
  tableOptions: PropTypes.object.isRequired,
  loadingOptions: PropTypes.object.isRequired
};

export default withStyles(styles)(BaseTable);
