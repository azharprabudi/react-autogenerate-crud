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
import Colors from "../../constants/colors";

const styles = theme => ({
  header: {
    backgroundColor: Colors.semiWhite
  }
});

class BaseTableHeader extends Component {
  onClickSortLabel = orderByNameColumn => () => {
    this.props.onChangeOrderBy(orderByNameColumn);
  };

  render() {
    const { sort, orderBy, columns, checkbox, classes } = this.props;
    return (
      <Fragment>
        <TableHead component="thead">
          <TableRow className={classes.header}>
            {checkbox && (
              <TableCell padding={"checkbox"}>
                <Checkbox
                  checked={this.props.isCheckAllItem}
                  onClick={this.props.onCheckAllItem}
                  style={{ color: Colors.red }}
                />
              </TableCell>
            )}
            {columns.map(itemColumn => (
              <TableCell key={itemColumn.title}>
                {has(itemColumn, "canBeSort") &&
                itemColumn.canBeSort === true &&
                itemColumn.type !== "custom" ? (
                  <TableSortLabel
                    direction={sort}
                    active={orderBy === itemColumn.objName}
                    onClick={this.onClickSortLabel(itemColumn.objName)}
                  >
                    <Typography variant={"subheading"}>
                      <b>{itemColumn.title.toUpperCase()}</b>
                    </Typography>
                  </TableSortLabel>
                ) : (
                  <Typography variant={"subheading"}>
                    <b>{itemColumn.title.toUpperCase()}</b>
                  </Typography>
                )}
              </TableCell>
            ))}
            {this.props.useAdditionalButton && (
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
  isCheckAllItem: PropTypes.bool.isRequired,
  onCheckAllItem: PropTypes.func.isRequired,
  onChangeOrderBy: PropTypes.func.isRequired,
  useAdditionalButton: PropTypes.bool.isRequired
};

export default withStyles(styles)(BaseTableHeader);
