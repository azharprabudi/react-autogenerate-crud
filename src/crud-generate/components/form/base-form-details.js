import React, { Component } from "react";

/* material modules */
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";

/* etc modules */
import has from "lodash/has";
import PropTypes from "prop-types";

/* my modules */
import lib from "./lib";
import Colors from "../../constants/colors";

const styles = theme => ({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 10,
    flexWrap: "wrap",
    marginBottom: 10,
    backgroundColor: "white"
  },
  btnAdd: {
    backgroundColor: Colors.blue,
    color: Colors.white
  },
  btnDelete: {
    backgroundColor: Colors.red,
    color: Colors.white
  }
});

class BaseFormDetail extends Component {
  renderItemInput = (
    uniqueId,
    itemState,
    { component, componentAttribute: { name, id, label, type, ...others } }
  ) => {
    if (typeof lib[component] !== "undefined") {
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
        <Typography variant="title" color="inherit">
          {title.toUpperCase()}
        </Typography>
        <Table>
          <TableHead>
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
                    size={"medium"}
                    variant={"contained"}
                    className={classes.btnAdd}
                    onClick={onClickAddRow}
                  >
                    <AddIcon />
                    Add Row
                  </Button>
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.map(itemState => {
              return (
                <TableRow key={itemState.uniqueId}>
                  {details.map(itemDetail => (
                    <TableCell key={itemDetail.componentAttribute.id}>
                      {this.renderItemInput(
                        itemState.uniqueId,
                        itemState.state,
                        itemDetail
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      size={"medium"}
                      variant={"contained"}
                      className={classes.btnDelete}
                      onClick={this.onClickRemoveRow(itemState.uniqueId)}
                    >
                      <DeleteIcon />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
