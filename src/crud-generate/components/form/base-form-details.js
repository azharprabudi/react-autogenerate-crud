import React, { Component } from "react";

/* material modules */
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";

/* my modules */
import lib from "./lib";

const styles = theme => ({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 15,
    paddingRight: 8,
    paddingLeft: 8,
    flexWrap: "wrap",
    marginBottom: 16,
    backgroundColor: "white"
  },
  wrapperTitle: {
    marginBottom: 15
  },
  table: {
    minWidth: 1020,
    borderRadius: 5,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(224, 224, 224, 1)"
  },
  tableWrapper: {
    overflowX: "auto"
  },
  tableHeader: {
    backgroundColor: "#f3f3f3"
  },
  btnAdd: {
    backgroundColor: theme.palette.alternative2.main,
    color: "#fff"
  },
  btnDelete: {
    backgroundColor: theme.palette.error.main,
    color: "#fff"
  }
});

class BaseFormDetail extends Component {
  renderItemInput = (
    uniqueId,
    itemState,
    { component, componentAttribute: { name, id, label, type, ...others } }
  ) => {
    if (typeof lib[component] !== "undefined" && type !== "hidden") {
      const SelectedComponent = lib[component];
      const { value, validationStatus, validationText } = itemState[name];

      let readonly = false;
      let disabled = false;
      let extension = {};

      /* condition readonly and disabled form */
      if (this.props.isEdit && has(others, "onEdit")) {
        if (has(others.onEdit, "readonly")) {
          readonly = others.onEdit.readonly;
        }

        if (has(others.onEdit, "disabled")) {
          disabled = others.onEdit.disabled;
        }
      } else if (!this.props.isEdit && has(others, "onAdd")) {
        if (has(others.onAdd, "readonly")) {
          readonly = others.onAdd.readonly;
        }

        if (has(others.onAdd, "disabled")) {
          disabled = others.onAdd.disabled;
        }
      }

      /* condition extension */
      if (has(others, "extension")) {
        extension = others.extension;
      }

      const style = has(others, "style") ? others.style : {};
      return (
        <TableCell key={id}>
          <SelectedComponent
            id={id}
            type={type}
            name={name}
            label={label}
            value={value}
            extension={others}
            readonly={readonly}
            disabled={disabled}
            extension={extension}
            error={!validationStatus}
            isEdit={this.props.isEdit}
            helperText={validationText}
            onChange={this.onChange(uniqueId, name)}
          />
        </TableCell>
      );
    }
    return null;
  };

  onChange = (index, stateName) => value => {
    this.props.onChange(index, stateName, value);
  };

  onClickRemoveRow = indexState => () => {
    this.props.onClickRemoveRow(indexState);
  };

  render() {
    const { classes, title, details, state, onClickAddRow } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.wrapperTitle}>
          <Typography variant="title" color="inherit">
            {`# ${title.toUpperCase()}`}
          </Typography>
        </div>
        <div className={classes.tableWrapper}>
          <Table component="table" className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                {details.map(item => (
                  <TableCell key={item.titleColumnTable}>
                    <Typography variant={"subheading"}>
                      <b>{item.titleColumnTable.toUpperCase()}</b>
                    </Typography>
                  </TableCell>
                ))}
                <TableCell>
                  <Typography variant={"subheading"}>
                    <Button
                      size={"small"}
                      variant={"contained"}
                      className={classes.btnAdd}
                      onClick={onClickAddRow}
                    >
                      <Typography color="inherit">Add Row</Typography>
                    </Button>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.map(itemState => {
                return (
                  <TableRow key={itemState.uniqueId}>
                    {details.map(itemDetail =>
                      this.renderItemInput(
                        itemState.uniqueId,
                        itemState.state,
                        itemDetail
                      )
                    )}
                    <TableCell>
                      <Button
                        size={"small"}
                        variant={"contained"}
                        className={classes.btnDelete}
                        onClick={this.onClickRemoveRow(itemState.uniqueId)}
                      >
                        <Typography color="inherit">Delete</Typography>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

BaseFormDetail.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.array.isRequired,
  state: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  isEdit: PropTypes.bool.isRequired
};

export default withStyles(styles)(BaseFormDetail);
