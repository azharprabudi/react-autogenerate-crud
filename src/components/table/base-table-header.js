import React, { Component, Fragment } from "react";

/* material ui */
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";

/* my modules */

class BaseTableHeader extends Component {
  onClickSortLabel = orderByNameColumn => () => {
    this.props.onChangeOrderBy(orderByNameColumn);
  };

  render() {
    const { sort, orderBy, columns } = this.props;
    return (
      <Fragment>
        <TableHead component="thead">
          <TableRow>
            {columns.map(headItem => (
              <TableCell key={headItem.title}>
                {has(headItem, "canBeSort") && headItem.canBeSort === true ? (
                  <TableSortLabel
                    active={orderBy === headItem.objName}
                    direction={sort}
                    onClick={this.onClickSortLabel(headItem.objName)}
                  >
                    <Typography variant={"subheading"}>
                      {headItem.title}
                    </Typography>
                  </TableSortLabel>
                ) : (
                  <Typography variant={"subheading"}>
                    {headItem.title}
                  </Typography>
                )}
              </TableCell>
            ))}
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
  onChangeOrderBy: PropTypes.func.isRequired
};

export default BaseTableHeader;
