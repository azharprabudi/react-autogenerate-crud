import React, { Component, Fragment } from "react";

/* material ui */
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";

/* my modules */

const styles = theme => ({
  header: {
    backgroundColor: "#f3f3f3"
  },
  checkbox: {
    color: theme.palette.primary.main
  }
});

class BaseTableHeader extends Component {
  onClickSortLabel = orderByNameColumn => () => {
    this.props.onChangeOrderBy(orderByNameColumn);
  };

  render() {
    const {
      sort,
      orderBy,
      columns,
      checkbox,
      classes,
      isCheckAllItem,
      onCheckAllItem,
      useAdditionalButtons
    } = this.props;
    return (
      <Fragment>
        <TableHead component="thead">
          <TableRow className={classes.header}>
            {checkbox && (
              <TableCell padding={"checkbox"}>
                <Checkbox
                  checked={isCheckAllItem}
                  onClick={onCheckAllItem}
                  className={classes.checkbox}
                />
              </TableCell>
            )}
            {columns.map(
              ({
                typeColumnTable,
                titleColumnTable,
                attributeColumnTable,
                ...others
              }) => (
                <TableCell key={attributeColumnTable}>
                  {has(others, "sortColumnTable") &&
                  others.sortColumnTable &&
                  others.typeColumnTable !== "custom" ? (
                    <TableSortLabel
                      direction={sort}
                      active={orderBy === attributeColumnTable}
                      onClick={this.onClickSortLabel(attributeColumnTable)}
                    >
                      <Typography variant={"subheading"}>
                        <b>{titleColumnTable.toUpperCase()}</b>
                      </Typography>
                    </TableSortLabel>
                  ) : (
                    <Typography variant={"subheading"}>
                      <b>{titleColumnTable.toUpperCase()}</b>
                    </Typography>
                  )}
                </TableCell>
              )
            )}
            {useAdditionalButtons && (
              <TableCell>
                <Typography>#</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
      </Fragment>
    );
  }
}

BaseTableHeader.propTypes = {
  sort: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  checkbox: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  isCheckAllItem: PropTypes.bool.isRequired,
  onCheckAllItem: PropTypes.func.isRequired,
  onChangeOrderBy: PropTypes.func.isRequired,
  useAdditionalButtons: PropTypes.bool.isRequired
};

export default withStyles(styles)(BaseTableHeader);
