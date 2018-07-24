import React, { PureComponent, Fragment } from "react";

/* material ui */
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import CircularProgress from "@material-ui/core/CircularProgress";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

/* etc modules */
import uniqueId from "lodash/uniqueId";
import isEqual from "lodash/isEqual";
import PropTypes from "prop-types";

/* my modules */
import BaseTableHeader from "./components/table-header";
import BaseTableBody from "./components/table-body";

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
      loading,
      title
    } = this.props;
    return (
      <Paper>
        <Toolbar>
          <Typography variant="title">{title}</Typography>
        </Toolbar>
        <Table component="table">
          <BaseTableHeader
            sort={sort}
            orderBy={orderBy}
            useCheckbox={useCheckbox}
            onChangeOrderBy={this.onChangeOrderBy}
            columns={tableOptions.columns}
            title={title}
          />
          <BaseTableBody />
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
