import React, { Component } from "react";

/* material modules */
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

/* etc modules */
import has from "lodash/has";
import moment from "moment";
import PropTypes from "prop-types";
import classNames from "classnames";
import uniqueId from "lodash/uniqueId";

/* my modules */
import Colors from "../../constants/colors";

const styles = theme => ({
  img: {
    maxWidth: 150,
    maxHeight: 150
  },
  checkbox: {
    color: Colors.red
  },
  button: {
    margin: theme.spacing.unit
  },
  buttonEdit: {
    backgroundColor: Colors.orange,
    color: Colors.white
  },
  buttonDelete: {
    backgroundColor: Colors.red,
    color: Colors.white
  }
});

class BaseTableBody extends Component {
  constructor(props) {
    super(props);

    const additionalButtons = has(props.additionalButtons, "button")
      ? props.additionalButtons.button
      : {};

    this.buttons = {
      edit: {
        label: "Edit",
        class: props.classes.buttonEdit,
        onClick: () => alert(1),
        size: "small",
        variant: "contained",
        style: {}
      },
      delete: {
        label: "Delete",
        class: props.classes.buttonDelete,
        onClick: () => alert(1),
        size: "small",
        variant: "contained",
        style: {}
      }
    };
  }

  onClickCheckbox = id => () => {
    this.props.onClickCheckbox(id);
  };

  getValueItemBody = (rawData, attrName) => {
    let attrSplit = attrName.split(".");
    if (attrSplit.length > 1) {
      let newRawData = rawData;
      for (let i = 0; i < attrSplit.length; i++) {
        newRawData = newRawData[attrSplit[i]];
      }
      return newRawData;
    }
    return rawData[attrName];
  };

  renderItemBody = (value, type) => {
    const { classes } = this.props;
    switch (type.toLowerCase()) {
      case "image":
        return <img src={value} alt={value} className={classes.img} />;
      case "date":
        return <Typography>{moment(value).format("YYYY-MM-D")}</Typography>;
      case "time":
        return <Typography>{moment(value).format("H:mm:ss")}</Typography>;
      case "datetime":
        return (
          <Typography>{moment(value).format("YYYY-MM-D, H:mm:ss")}</Typography>
        );
      case "longtext":
        return <Typography>{`${value.substr(0, 50)}...`}</Typography>;
      case "nominal":
        return <Typography>{value.toLocaleString()}</Typography>;
      default:
        return <Typography>{value}</Typography>;
    }
  };

  renderAdditionalButtons = item => {
    let buttons = [];
    for (let [index, item] of Object.entries(this.buttons)) {
      buttons = [
        ...buttons,
        <Button
          size={item.size}
          key={item.label}
          style={item.style}
          variant={item.variant}
          onClick={item.onClick}
          className={classNames(this.props.classes.button, item.class)}
        >
          {item.label}
        </Button>
      ];
    }
    return buttons;
  };

  render() {
    const {
      data,
      columns,
      checkbox,
      classes,
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
                    className={classes.checkbox}
                    onClick={this.onClickCheckbox(itemBody[checkboxObjName])}
                  />
                </TableCell>
              )}
              {columns.map(itemColumn => {
                const realValue = this.getValueItemBody(
                  itemBody,
                  itemColumn.objName
                );
                return (
                  <TableCell key={realValue}>
                    {this.renderItemBody(realValue, itemColumn.type)}
                  </TableCell>
                );
              })}
              {this.props.additionalButtons.enable && (
                <TableCell>{this.renderAdditionalButtons(itemBody)}</TableCell>
              )}
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
  checkboxObjName: PropTypes.string.isRequired,
  additionalButtons: PropTypes.object.isRequired
};

BaseTableBody.defaultProps = {
  onClickCheckbox: () => {}
};

export default withStyles(styles)(BaseTableBody);
