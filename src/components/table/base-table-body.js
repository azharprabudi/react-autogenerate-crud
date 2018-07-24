import React, { Component } from "react";

/* material modules */
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";

const styles = theme => ({
  img: {
    maxWidth: 150,
    maxHeight: 150
  }
});

class BaseTableBody extends Component {
  onClickCheckbox = id => () => {
    this.props.onClickCheckbox(id);
  };

  renderItemBody = (value, type) => {
    switch (type.toLowerCase()) {
      case "image":
        return (
          <img src={value} alt={value} className={this.props.classes.img} />
        );
      default:
        return <Typography>{value}</Typography>;
    }
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
                  {this.renderItemBody(
                    itemBody[itemColumn.objName],
                    itemColumn.type
                  )}
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

export default withStyles(styles)(BaseTableBody);
