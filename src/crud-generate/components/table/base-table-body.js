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
import omit from "lodash/omit";
import PropTypes from "prop-types";
import classNames from "classnames";

/* my modules */
import BaseForm from "../../base/base-form";
import { thousandSeparator } from "../../helpers/custom-function";

const styles = theme => ({
  img: {
    maxWidth: 150,
    maxHeight: 150
  },
  button: {
    margin: theme.spacing.unit
  },
  buttonEdit: {
    backgroundColor: theme.palette.alternative1.main,
    color: "#fff"
  },
  buttonDelete: {
    backgroundColor: theme.palette.error.main,
    color: "#fff"
  },
  icon: {
    marginHorizontal: theme.spacing.unit
  },
  checkbox: {
    color: theme.palette.primary.main
  }
});

class BaseTableBody extends Component {
  constructor(props) {
    super(props);

    const { additionalRowColumn, aclSelected } = props;

    let additionalButtons =
      has(additionalRowColumn, "row") &&
      has(additionalRowColumn, "additionalButtons")
        ? additionalRowColumn.row.additionalButtons
        : {};

    /* if there any configuration for button edit can replace here */
    let buttonEdit = {};
    let buttonDelete = {};

    if (has(aclSelected, "update") && aclSelected.update) {
      buttonEdit = {
        label: "Edit",
        class: props.classes.buttonEdit,
        onClick: null,
        size: "small",
        variant: "contained",
        style: {},
        href: "",
        type: "button",
        iconName: "Edit",
        ...additionalButtons.update
      };
      additionalButtons = omit(additionalButtons, "update");
    }

    if (has(aclSelected, "delete") && aclSelected.update) {
      buttonDelete = {
        label: "Delete",
        class: props.classes.buttonDelete,
        onClick: null,
        size: "small",
        variant: "contained",
        style: {},
        href: "",
        type: "button",
        iconName: "Delete",
        ...additionalButtons.delete
      };
      additionalButtons = omit(additionalButtons, "delete");
    }

    this.buttons = {
      update: buttonEdit,
      delete: buttonDelete,
      ...additionalButtons
    };
  }

  onClickCheckbox = id => () => {
    this.props.onClickCheckbox(id);
  };

  getValueEachColumn = (rawData, attrName) => {
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

  renderItemEachColumn = (data, itemColumn) => {
    const { classes } = this.props;
    const prefix = has(itemColumn, "prefixColumnTable")
      ? itemColumn.prefixColumnTable
      : "";
    const valueEachColumn = `${prefix} ${this.getValueEachColumn(
      data,
      itemColumn.attributeColumnTable
    )}`;
    switch (itemColumn.typeColumnTable) {
      case "image":
        return (
          <img
            src={valueEachColumn}
            alt={valueEachColumn}
            className={classes.img}
          />
        );
      case "date":
        return (
          <Typography>{moment(valueEachColumn).format("YYYY-MM-D")}</Typography>
        );
      case "time":
        return (
          <Typography>{moment(valueEachColumn).format("H:mm:ss")}</Typography>
        );
      case "datetime":
        return (
          <Typography>
            {moment(valueEachColumn).format("YYYY-MM-D, H:mm:ss")}
          </Typography>
        );
      case "longtext":
        return <Typography>{`${valueEachColumn.substr(0, 50)}...`}</Typography>;
      case "nominal":
        return <Typography>{thousandSeparator(valueEachColumn)}</Typography>;
      case "custom":
        return (
          <div>
            {has(itemColumn, "onCustomValue")
              ? itemColumn.onCustomValue(data)
              : ""}
          </div>
        );
      default:
        return <Typography>{valueEachColumn}</Typography>;
    }
  };

  renderAdditionalButtons = rowData => {
    let buttons = [];
    for (let [index, item] of Object.entries(this.buttons)) {
      /* if there any configuration to change the url to be the real data */
      let href = "";
      if (
        item.type === "link" &&
        has(this.props.additionalButtons, "replaceUrl") &&
        Object.keys(this.props.additionalButtons.replaceUrl).length > 0
      ) {
        href = item.href;
        for (let [indexReplaceUrl, itemReplaceUrl] of Object.entries(
          this.props.additionalButtons.replaceUrl
        )) {
          href = href.replace(indexReplaceUrl, rowData[itemReplaceUrl]);
        }
      }

      /* if the item has the icon name give the icon */
      let IconSelected = "";
      if (has(item, "iconName") && item.iconName !== "") {
        let Icon = require(`@material-ui/icons/${item.iconName}`);
        if (has(Icon, "default")) {
          IconSelected = Icon.default;
        }
      }

      /* replace the function */
      let funcOnClick = null;
      if (index === "update" && item.onClick === null) {
        funcOnClick = () => {
          this.props.onToggleFormDialog("Edit", {
            [BaseForm.ID_FORM]: rowData[
              this.props.editAttributeName
            ].toString(),
            [BaseForm.EXISTING_DATA_FROM_PROPS]: this.props.dataFromProps
              ? rowData
              : {}
          });
        };
      } else if (index == "delete" && item.onClick === null) {
        funcOnClick = () => {
          this.props.onClickDeleteRowItem(
            rowData[this.props.deleteAttributeName]
          );
        };
      } else {
        funcOnClick = item.onClick;
      }

      buttons = [
        ...buttons,
        <Button
          size={item.size}
          key={item.label}
          style={item.style}
          onClick={funcOnClick}
          variant={item.variant}
          href={item.type === "link" ? href : ""}
          className={classNames(this.props.classes.button, item.class)}
        >
          {IconSelected !== "" && (
            <IconSelected className={this.props.classes.icon} />
          )}
          {item.label}
        </Button>
      ];
    }
    return buttons;
  };

  render() {
    const {
      data,
      classes,
      columns,
      checkbox,
      listChecked,
      deleteAttributeName,
      useAdditionalButtons
    } = this.props;
    return (
      <TableBody component="tbody">
        {data.map(item => (
          <TableRow key={item[deleteAttributeName]} hover>
            {checkbox && (
              <TableCell padding={"checkbox"}>
                <Checkbox
                  checked={listChecked.indexOf(item[deleteAttributeName]) > -1}
                  onClick={this.onClickCheckbox(item[deleteAttributeName])}
                  className={classes.checkbox}
                />
              </TableCell>
            )}
            {columns.map(itemColumn => (
              <TableCell key={item[itemColumn.attributeColumnTable]}>
                {this.renderItemEachColumn(item, itemColumn)}
              </TableCell>
            ))}
            {useAdditionalButtons && (
              <TableCell>{this.renderAdditionalButtons(item)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    );
  }
}

BaseTableBody.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  checkbox: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  listChecked: PropTypes.array.isRequired,
  onClickCheckbox: PropTypes.func.isRequired,
  onToggleFormDialog: PropTypes.func.isRequired,
  onClickDeleteRowItem: PropTypes.func.isRequired,
  deleteAttributeName: PropTypes.string.isRequired,
  additionalRowColumn: PropTypes.shape({
    replaceUrl: PropTypes.string,
    attributeName: PropTypes.string,
    additionalButtons: PropTypes.object
  }),
  aclSelected: PropTypes.shape({
    create: PropTypes.bool,
    read: PropTypes.bool,
    update: PropTypes.bool,
    delete: PropTypes.bool
  }),
  dataFromProps: PropTypes.bool.isRequired,
  useAdditionalButtons: PropTypes.bool.isRequired
};

export default withStyles(styles)(BaseTableBody);
