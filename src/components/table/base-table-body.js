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
  },
  icon: {
    marginHorizontal: theme.spacing.unit
  }
});

class BaseTableBody extends Component {
  constructor(props) {
    super(props);

    let additionalButtons = has(props.additionalButtons, "button")
      ? props.additionalButtons.button
      : {};

    /* if there any configuration for button edit can replace here */
    let configurationEditButton = {
      label: "Edit",
      class: props.classes.buttonEdit,
      onClick: () => alert(1),
      size: "small",
      variant: "contained",
      style: {},
      href: "",
      type: "button",
      iconName: "Edit"
    };
    if (
      has(additionalButtons, "edit") &&
      Object.keys(additionalButtons.edit).length > 0
    ) {
      configurationEditButton = {
        ...configurationEditButton,
        ...additionalButtons.edit
      };
      /* remove index edit  */
      additionalButtons = omit(additionalButtons, "edit");
    } else if (
      has(additionalButtons, "edit") &&
      Object.keys(additionalButtons.edit).length === 0
    ) {
      configurationEditButton = {};
      /* remove index edit  */
      additionalButtons = omit(additionalButtons, "edit");
    }

    /* if there any configuration for button delete can replace here */
    let configurationDeleteButton = {
      label: "Delete",
      class: props.classes.buttonDelete,
      onClick: () => alert(1),
      size: "small",
      variant: "contained",
      style: {},
      href: "",
      type: "button",
      iconName: "Delete"
    };

    if (
      has(additionalButtons, "delete") &&
      Object.keys(additionalButtons.delete).length > 0
    ) {
      configurationDeleteButton = {
        ...configurationDeleteButton,
        ...additionalButtons.delete
      };
      additionalButtons = omit(additionalButtons, "delete");
    } else if (
      has(additionalButtons, "delete") &&
      Object.keys(additionalButtons.delete).length === 0
    ) {
      configurationDeleteButton = {};
      additionalButtons = omit(additionalButtons, "delete");
    }
    this.buttons = {
      edit: configurationEditButton,
      delete: configurationDeleteButton,
      ...additionalButtons
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

  renderItemBody = (itemBody, itemColumn) => {
    const { classes } = this.props;
    const value = this.getValueItemBody(itemBody, itemColumn.objName);
    switch (itemColumn.type.toLowerCase()) {
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
      case "custom":
        return (
          <Typography>
            {has(itemColumn, "onCustomValue")
              ? itemColumn.onCustomValue(itemBody)
              : ""}
          </Typography>
        );
      default:
        return <Typography>{value}</Typography>;
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
      /* end change url */

      /* if the item has the icon name give the icon */
      let IconSelected = "";
      if (has(item, "iconName") && item.iconName !== "") {
        let Icon = require(`@material-ui/icons/${item.iconName}`);
        if (has(Icon, "default")) {
          IconSelected = Icon.default;
        }
      }

      buttons = [
        ...buttons,
        <Button
          size={item.size}
          key={item.label}
          style={item.style}
          variant={item.variant}
          onClick={item.type === "button" ? item.onClick : () => {}}
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
              {columns.map(itemColumn => (
                <TableCell key={uniqueId(itemColumn.title)}>
                  {this.renderItemBody(itemBody, itemColumn)}
                </TableCell>
              ))}
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
